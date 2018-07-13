#!/usr/bin/env python

import csv
import utils
import os


def run(options):
  # Input: A path to the root of a domain-scan output directory.
  scan_path = options.get("scan", ".")
  results_path = os.path.join(scan_path, "results")

  # Output: Where to put the post-processed results.
  output_path = options.get("output", ".")


  # Take the uswds scan data and cut it down to just the rows for
  # which the bad banner text is enabled, and only the data needed for it,
  # in JSON form.

  uswds_csv = os.path.join(results_path, "uswds.csv")

  # collect list of dicts to convert into JSON
  bad_banner = []
  uswds_present = []

  with open(uswds_csv, newline='') as csvfile:
    for dict_row in csv.DictReader(csvfile):

      has_bad_banner = utils.boolean_for(dict_row["USWDS Bad Banner Text"])
      is_uswds_present = utils.boolean_for(dict_row["USWDS Present"])

      if (has_bad_banner):
        bad_banner.append({
          'hostname': dict_row["Domain"],
          'base_domain': dict_row["Base Domain"],
          'scanned_url': dict_row["Scanned URL"]
        })

      if (is_uswds_present):
        uswds_present.append({
          'hostname': dict_row["Domain"],
          'base_domain': dict_row["Base Domain"],
          'scanned_url': dict_row["Scanned URL"]
        })

  # Save resulting JSON.
  bad_banner_data = utils.json_for(bad_banner)
  bad_banner_output = os.path.join(output_path, "bad_banner.json")
  utils.write(bad_banner_data, bad_banner_output)

  uswds_present_data = utils.json_for(uswds_present)
  uswds_present_output = os.path.join(output_path, "uswds_present.json")
  utils.write(uswds_present_data, uswds_present_output)


if __name__ == '__main__':
    run(utils.options())
