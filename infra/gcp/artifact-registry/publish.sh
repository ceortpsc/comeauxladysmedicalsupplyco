#!/usr/bin/env bash
set -euo pipefail
: "${GCP_PROJECT_ID:?GCP_PROJECT_ID required}"
: "${GCP_ARTIFACT_LOCATION:=us-central1}"
GENERIC_REPO="${GCP_ARTIFACT_GENERIC_REPO:-comeaux-release-artifacts}"
DOCKER_REPO="${GCP_ARTIFACT_DOCKER_REPO:-comeaux-containers}"
VERSION="${APP_VERSION:-0.1.0}"

gcloud config set project "${GCP_PROJECT_ID}"
gcloud services enable artifactregistry.googleapis.com

gcloud artifacts repositories describe "${GENERIC_REPO}" --location="${GCP_ARTIFACT_LOCATION}" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "${GENERIC_REPO}" --repository-format=generic --location="${GCP_ARTIFACT_LOCATION}" --description="Comeaux immutable release artifacts"

gcloud artifacts repositories describe "${DOCKER_REPO}" --location="${GCP_ARTIFACT_LOCATION}" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "${DOCKER_REPO}" --repository-format=docker --location="${GCP_ARTIFACT_LOCATION}" --description="Comeaux platform container images"

gcloud artifacts generic upload --project="${GCP_PROJECT_ID}" --location="${GCP_ARTIFACT_LOCATION}" --repository="${GENERIC_REPO}" --package="platform-openapi" --version="${VERSION}" --source="contracts/comeaux-platform.openapi.yaml"
gcloud artifacts generic upload --project="${GCP_PROJECT_ID}" --location="${GCP_ARTIFACT_LOCATION}" --repository="${GENERIC_REPO}" --package="release-registry" --version="${VERSION}" --source="config/artifacts.json"
