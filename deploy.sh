#!/usr/bin/bash

npm run build
docker build -t rummikub:latest .
docker tag rummikub:latest registry.digitalocean.com/rummikub/rummikub:latest
docker push registry.digitalocean.com/rummikub/rummikub:latest
