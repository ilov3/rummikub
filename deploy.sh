#!/usr/bin/env bash

npm run build
docker build --platform=linux/amd64 -t ilov3/rummi:latest .
docker push ilov3/rummi:latest
