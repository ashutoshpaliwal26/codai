#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables (edit as needed)
IMAGE_NAME="ashutoshpaliwal/code-editor:ide"
CONTAINER_NAME="cmd"
DOCKER_COMMAND="echo Hello from inside the container"

# Pull image if not already present
docker pull $IMAGE_NAME

# Run container (interactive mode with auto-remove)
docker run --rm -it \
  --name $CONTAINER_NAME \
  -p 8001:8001 \
  $IMAGE_NAME \
  bash -c "$DOCKER_COMMAND"
