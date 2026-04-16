#!/usr/bin/env bash
# Generates infra/k8s/01-secrets.yaml from the root .env file.
# Usage: bash infra/scripts/gen-k8s-secrets.sh [path/to/.env]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/.env}"
OUT_FILE="$ROOT_DIR/infra/k8s/01-secrets.yaml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env file not found at $ENV_FILE"
  exit 1
fi

# Source the .env file to load variables
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

get_val() {
  local var="$1"
  local default="${2:-}"
  echo "${!var:-$default}"
}

cat > "$OUT_FILE" <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: healio-secrets
  namespace: healio
type: Opaque
stringData:
  JWT_SECRET: "$(get_val JWT_SECRET)"
  STRIPE_SECRET_KEY: "$(get_val STRIPE_SECRET_KEY)"
  STRIPE_WEBHOOK_SECRET: "$(get_val STRIPE_WEBHOOK_SECRET)"
  CLOUDINARY_CLOUD_NAME: "$(get_val CLOUDINARY_CLOUD_NAME)"
  CLOUDINARY_API_KEY: "$(get_val CLOUDINARY_API_KEY)"
  CLOUDINARY_API_SECRET: "$(get_val CLOUDINARY_API_SECRET)"
  SMTP_USER: "$(get_val SMTP_USER)"
  SMTP_PASS: "$(get_val SMTP_PASS)"
  NOTIFY_LK_USER_ID: "$(get_val NOTIFY_LK_USER_ID)"
  NOTIFY_LK_API_KEY: "$(get_val NOTIFY_LK_API_KEY)"
  GROQ_API_KEY: "$(get_val GROQ_API_KEY)"
EOF

echo "Generated $OUT_FILE"
