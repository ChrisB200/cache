#!/bin/bash
 
eval "$(conda shell.bash hook)"
python build/symlink.py --name "$1"
docker stop react-app || true
docker rm react-app || true
docker stop flask-api || true
docker rm flask-api || true
docker compose up -d --force-recreate
