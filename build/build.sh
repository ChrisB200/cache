#!/bin/bash

# Ensure Docker is running
if ! docker info &>/dev/null; then
    echo "Docker is not running. Please start Docker."
    exit 1
fi

# Build new images without stopping running containers
docker compose build --no-cache

# Start new containers without stopping old ones
docker compose up -d --no-deps --build

# Wait a few seconds to ensure new containers are running
sleep 5

# Remove old containers safely (only if they are still running)
docker ps -q --filter "name=react-app" | grep -q . && docker rm -f react-app
docker ps -q --filter "name=flask-api" | grep -q . && docker rm -f flask-api

# Ensure the first symlink (nginx.conf -> sites-available/cache.conf) exists
SOURCE_FILE="nginx.conf"
TARGET_LINK="/etc/nginx/sites-available/cache.conf"
TARGET_ENABLE="/etc/nginx/sites-enabled/cache.conf"

if [ ! -L "$TARGET_LINK" ]; then
    ln -sf "$(realpath "$SOURCE_FILE")" "$TARGET_LINK"
    echo "Symlink created: $TARGET_LINK -> $SOURCE_FILE"
else
    echo "Symlink already exists: $TARGET_LINK"
fi

if [ ! -L "$TARGET_ENABLE" ]; then
    ln -s "$TARGET_LINK" "$TARGET_ENABLE"
    echo "Symlink created: $TARGET_ENABLE -> $TARGET_LINK"
else
    echo "Symlink already exists: $TARGET_ENABLE"
fi

# Wait for services to stabilize
sleep 2

# Reload nginx only if it's running
if systemctl is-active --quiet nginx; then
    sudo /bin/systemctl reload nginx
    echo "Nginx reloaded successfully."
else
    echo "Warning: Nginx is not running!"
fi

