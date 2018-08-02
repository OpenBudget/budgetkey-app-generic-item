#!/usr/bin/env python
import tabulator
import json
import os

base_dir = os.path.dirname(__file__)

tooltips=tabulator.Stream('https://docs.google.com/spreadsheets/d/1ztsoslfvEiQS1jSTrivU6chvyAySIIV9tad0L1ZKGj8/edit#gid=0', headers=1).open()
tooltips = list(tooltips.iter())
tooltips = sorted(tooltips, key=lambda x: len(x[0]), reverse=True)
json.dump(tooltips, 
          open(os.path.join(base_dir, 'tooltips.json'), 'w'), 
          ensure_ascii=False,
          indent=2)

