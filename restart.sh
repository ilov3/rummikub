#!/usr/bin/env bash

docker kill rummi
docker pull ilov3/rummi:latest
docker run -d --rm -p 9119:9119 --name rummi ilov3/rummi
sudo systemctl reload nginx
