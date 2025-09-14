#!/bin/bash
set -e

echo "hello"
# Build new images (no secrets here)
docker compose build --no-cache

echo "passed"

# Remove old containers safely
docker ps -q --filter "name=cache-react" | grep -q . && docker rm -f cache-react
docker ps -q --filter "name=cache-api" | grep -q . && docker rm -f cache-api

# Inject secrets here using 1Password
op run --env-file ./api/.env.prod \
    --env-file ./react/.env.prod \
    -- docker compose up -d --no-deps --build

# Wait a few seconds to ensure new containers are running
# sleep 5
#
# CWD=$(pwd)
#
# # Ensure the first symlink (nginx.conf -> sites-available/cache.conf) exists
# SOURCE_FILE="$CWD/nginx.conf"
# TARGET_LINK="/etc/nginx/sites-available/cache.conf"
# TARGET_ENABLE="/etc/nginx/sites-enabled/cache.conf"
#
# if [ ! -L "$TARGET_LINK" ]; then
#     ln -sf "$(realpath "$SOURCE_FILE")" "$TARGET_LINK"
#     echo "Symlink created: $TARGET_LINK -> $SOURCE_FILE"
# else
#     echo "Symlink already exists: $TARGET_LINK"
# fi
#
# if [ ! -L "$TARGET_ENABLE" ]; then
#     ln -s "$TARGET_LINK" "$TARGET_ENABLE"
#     echo "Symlink created: $TARGET_ENABLE -> $TARGET_LINK"
# else
#     echo "Symlink already exists: $TARGET_ENABLE"
# fi
#
# # Test config first
# if sudo nginx -t; then
#     if systemctl is-active --quiet nginx; then
#         sudo systemctl reload nginx
#         echo "Nginx reloaded successfully."
#     else
#         echo "Warning: Nginx is not running! Starting it..."
#         sudo systemctl start nginx
#     fi
# else
#     echo "Nginx config test failed. Not reloading."
#     exit 1
# fi
