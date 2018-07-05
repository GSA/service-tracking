
import sys
import json
import os
import datetime
import errno

# Quick and dirty CLI options parser.
def options():
  options = {}
  for arg in sys.argv[1:]:
    if arg.startswith("--"):

      if "=" in arg:
        key, value = arg.split('=')
      else:
        key, value = arg, "true"

      key = key.split("--")[1]
      key = key.lower()
      value = value.lower()

      if value == 'true': value = True
      elif value == 'false': value = False
      options[key] = value

  return options

def boolean_for(string):
  if string == "False":
    return False
  elif string == "True":
    return True
  else:
    return None

# mkdir -p in python, from:
# https://stackoverflow.com/questions/600268/mkdir-p-functionality-in-python
def mkdir_p(path):
  try:
    os.makedirs(path)
  except OSError as exc:  # Python >2.5
    if exc.errno == errno.EEXIST:
      pass
    else:
      raise

def write(content, destination, binary=False):
  mkdir_p(os.path.dirname(destination))

  if binary:
    f = open(destination, 'bw')
  else:
    f = open(destination, 'w', encoding='utf-8')
  f.write(content)
  f.close()


# Format datetimes, sort keys, pretty-print.
def json_for(object):
    return json.dumps(object, sort_keys=True, indent=2, default=format_datetime)

def format_datetime(obj):
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, str):
        return obj
    else:
        return None
