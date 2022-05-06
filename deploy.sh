#!/usr/bin/env bash

npm run build
docker build -t ilov3/rummi:latest .
docker push ilov3/rummi:latest
