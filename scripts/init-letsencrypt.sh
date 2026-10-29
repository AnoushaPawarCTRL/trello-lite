#!/bin/bash
# Gets your FIRST HTTPS certificate. Run once on the VPS:  ./scripts/init-letsencrypt.sh
# After this, the certbot container handles renewals by itself.
#
# The chicken and egg problem this solves:
#   nginx won't start without a certificate file, but Let's Encrypt needs
#   nginx running (on port 80) to prove you own the domain.
# So: make a throwaway self signed cert, start nginx, swap in the real one.

set -e
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "No .env file. Run: cp .env.example .env  and fill it in first."
  exit 1
fi
set -a; source .env; set +a

# Set STAGING=1 to test against Let's Encrypt's practice server first.
# It has generous rate limits; the real one locks you out for a week
# after 5 failed attempts.
STAGING=${STAGING:-0}

CERT_DIR="certbot/conf/live/$DOMAIN"

echo "### 1/4 Creating a temporary self signed certificate for $DOMAIN"
mkdir -p "$CERT_DIR" certbot/www
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj /CN=localhost" certbot

echo "### 2/4 Building and starting the app"
docker compose up -d --build

echo "### 3/4 Deleting the temporary certificate"
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN \
         /etc/letsencrypt/archive/$DOMAIN \
         /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "### 4/4 Requesting the real certificate from Let's Encrypt"
STAGING_ARG=""
if [ "$STAGING" = "1" ]; then STAGING_ARG="--staging"; fi
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $STAGING_ARG \
    -d $DOMAIN \
    --email $CERTBOT_EMAIL \
    --rsa-key-size 4096 \
    --agree-tos --no-eff-email \
    --force-renewal" certbot

docker compose exec nginx nginx -s reload
echo "### Done. Visit https://$DOMAIN"
