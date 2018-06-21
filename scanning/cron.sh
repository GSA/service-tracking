#!/bin/bash

# Pre-requisites:
# * The `aws` command is available through the awscli PyPi package.
# * It's configured with AWS credentials already, such as in ~/.aws/credentials.

### Define stuff

source $HOME/.bashrc

export BIGQUERY_CREDENTIALS_PATH=/opt/credentials/gsa-gcp-pilot-6e3504ee5191.json
export DOMAIN_SCAN_HOME=/opt/scan/domain-scan

export TODAY=`date +%Y-%m-%d`

export GATHER_DEST=/opt/scan/space/nightly/$TODAY/gather
export SCAN_DEST=/opt/scan/space/nightly/$TODAY/scan

export S3_BUCKET=tts-public-data

### Do stuff

mkdir -p $GATHER_DEST
mkdir -p $SCAN_DEST

cd $DOMAIN_SCAN_HOME

./gather censys,dap,eot2016,rdns-snapshot,other,dotgov --eot2016=https://github.com/GSA/data/raw/master/end-of-term-archive-csv/eot-2016-seeds.csv --rdns-snapshot=https://github.com/GSA/data/raw/master/dotgov-websites/rdns-federal-snapshot.csv --dap=https://analytics.usa.gov/data/live/sites-extended.csv --other=https://github.com/GSA/data/raw/master/dotgov-websites/other-websites.csv --dotgov=https://github.com/GSA/data/raw/master/dotgov-domains/current-federal.csv --suffix=.gov,.fed.us --parents=https://github.com/GSA/data/raw/master/dotgov-domains/current-federal.csv --include-parents --ignore-www --debug --output=$GATHER_DEST

# aws s3 sync /opt/scan/space/nightly/$TODAY/gather
