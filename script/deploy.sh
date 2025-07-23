#!/bin/bash

set -e

echo "✅ Starting Deployment Script..."

echo " |->>> Stopping all running Docker containers..."
sudo docker ps -q | xargs -r sudo docker stop

echo " |->>> Removing all containers..."
sudo docker ps -aq | xargs -r sudo docker rm

echo " |->>> Removing all Docker images..."
sudo docker images -q | xargs -r sudo docker rmi -f

echo " |->>> Building and running containers with docker-compose..."
cd /home/ashutoshpaliwal26/codai  # change this if needed

# Use the correct docker compose syntax (space, not dash) for modern Docker versions
sudo docker compose --env-file ../../.env up --build -d

echo "✅ Deployment completed!"