#!/bin/bash

eval "$(conda shell.bash hook)"
conda activate personal-finance-worker
python "$1" all -a

