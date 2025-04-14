#!/bin/bash

# Default values
TEST_NUMBER=${1:-0}
DURATION=${2:-60s}

echo "Running test ${TEST_NUMBER} for ${DURATION}..."

# Clearing the db
echo "Deleting tags..."
docker exec -it research-nodejs-and-mongodb-performance-mongodb-1 mongosh financial_db --eval "db.tags.deleteMany({})"
echo "Deleting financial_records..."
docker exec -it research-nodejs-and-mongodb-performance-mongodb-1 mongosh financial_db --eval "db.financialrecords.deleteMany({})"

echo "Running populate.js..."
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=./reports/test-${TEST_NUMBER}-populate.html k6 run --vus 100 --duration ${DURATION} populate.js

# Connect to the database and getting count of tags
docker exec research-nodejs-and-mongodb-performance-mongodb-1 mongosh --quiet financial_db --eval "db.tags.countDocuments()" > ./reports/test-${TEST_NUMBER}-populate-tags-count.txt
echo "Tags: $(cat ./reports/test-${TEST_NUMBER}-populate-tags-count.txt)"

# Connect to the database and getting count of financial records
docker exec research-nodejs-and-mongodb-performance-mongodb-1 mongosh --quiet financial_db --eval "db.financialrecords.countDocuments()" > ./reports/test-${TEST_NUMBER}-populate-financial-records-count.txt
echo "Financial records: $(cat ./reports/test-${TEST_NUMBER}-populate-financial-records-count.txt)"

echo "Running cash-flow.js..."
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=./reports/test-${TEST_NUMBER}-cash-flow.html k6 run --vus 100 --duration 60s cash-flow.js
