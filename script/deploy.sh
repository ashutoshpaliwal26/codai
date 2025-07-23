#!/bin/bash

# Exit immediately if any command fails
set -e

sudo su

echo " |->>> Pull recent Changes"
cd git pull

echo " |->>> Stopping all running Docker containers..."
docker stop $(docker ps -q) 2>/dev/null || echo " [*] : No running containers."

echo " |->>> Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove."

echo " |->>> Removing all Docker images..."
docker rmi -f $(docker images -q) 2>/dev/null || echo "No images to remove."

echo " |->>> Running docker-compose up --build..."
docker-compose up --rm mongo_db

echo " |->>> Running Gateway NGINX "
nginx -t && systemctl restart nginx