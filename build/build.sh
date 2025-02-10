#!/bin/bash
 
eval "$(conda shell.bash hook)"
python build/symlink.py --name "$1"
docker compose up -d --force-recreate
