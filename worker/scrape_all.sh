#!/bin/bash

conda init
conda activate personal-finance-worker
python ~/code/personal-finance/worker/worker.py all -a
conda deactivate
