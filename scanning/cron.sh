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
export S3_PREFIX=service-tracking

### Do stuff

mkdir -p $GATHER_DEST
mkdir -p $SCAN_DEST

cd $DOMAIN_SCAN_HOME

# Discover federal .gov and .fed.us hostnames from public sources.
./gather censys,dap,eot2016,rdns-snapshot,other,dotgov --eot2016=https://github.com/GSA/data/raw/master/end-of-term-archive-csv/eot-2016-seeds.csv --rdns-snapshot=https://github.com/GSA/data/raw/master/dotgov-websites/rdns-federal-snapshot.csv --dap=https://analytics.usa.gov/data/live/sites-extended.csv --other=https://github.com/GSA/data/raw/master/dotgov-websites/other-websites.csv --dotgov=https://github.com/GSA/data/raw/master/dotgov-domains/current-federal.csv --suffix=.gov,.fed.us --parents=https://github.com/GSA/data/raw/master/dotgov-domains/current-federal.csv --include-parents --ignore-www --debug --output=$GATHER_DEST

# Scan those hostnames:
#
# 1) First with pshtt to determine which hostnames are "live", which ones are just redirectors, and the "canonical" URL for each hostname.
# 2) Then with other scanners which may use that data, such as the third party services scanner. Scanners may make use of pshtt data to skip over non-live services or those with other properties.
#
# Use 900 workers to keep under the 1000 account-wide limit.
# Make sure to schedule so as not to run at the same time as other scans that are making similarly full use of the account limit.
./scan $GATHER_DEST/results/gathered.csv --scan=pshtt,third_parties --output=$SCAN_DEST --sort --meta --lambda --workers=900

# Upload the discovery and scan data to a public S3 bucket.
# Publish to a single "live" path prefix to have data update in place,
# while also copying to a timestamped directory to archive data historically.

aws s3 sync $GATHER_DEST s3://$S3_BUCKET/$S3_PREFIX/live/gather/ --acl=public-read --delete

aws s3 sync s3://$S3_BUCKET/$S3_PREFIX/live/gather/ s3://$S3_BUCKET/$S3_PREFIX/archive/$TODAY/gather/ --acl=public-read

aws s3 sync $SCAN_DEST s3://$S3_BUCKET/$S3_PREFIX/live/scan/ --acl=public-read --delete

aws s3 sync s3://$S3_BUCKET/$S3_PREFIX/live/scan/ s3://$S3_BUCKET/$S3_PREFIX/archive/$TODAY/scan/ --acl=public-read
