#!/usr/bin/env bash
set -euo pipefail
: "${GCP_API_HUB_PROJECT:?GCP_API_HUB_PROJECT required}"
: "${GCP_API_HUB_LOCATION:=us-central1}"
API_ID="${COMEAUX_API_ID:-comeaux-platform}"
VERSION_ID="${COMEAUX_API_VERSION_ID:-v0-1-0}"
SPEC_ID="${COMEAUX_API_SPEC_ID:-openapi}"
SPEC="contracts/comeaux-platform.openapi.yaml"

echo "API Hub host project: ${GCP_API_HUB_PROJECT}"
echo "Location: ${GCP_API_HUB_LOCATION}"
echo "API: ${API_ID} / version: ${VERSION_ID} / spec: ${SPEC_ID}"
echo "This script is an execution contract. Run only with authenticated gcloud credentials and an already provisioned API Hub host project."

gcloud config set project "${GCP_API_HUB_PROJECT}"
gcloud services enable apihub.googleapis.com
# Exact command surface can evolve; use the currently installed gcloud API Hub component/REST endpoint to create API, version and spec.
# Do not report registration successful until resources are read back after creation.
sha256sum "${SPEC}"
