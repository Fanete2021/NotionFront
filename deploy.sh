#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

TAG="${1:-}"
COMPOSE=(docker compose -f docker-compose.prod.yml)

if [[ ! "$TAG" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$ ]]; then
  echo "Usage: ./deploy.sh <image-tag>" >&2
  exit 2
fi

if [[ ! -f .env ]]; then
  echo "Missing server-side .env file" >&2
  exit 1
fi

set_image_tag() {
  local new_tag="$1"
  local temp_file
  temp_file="$(mktemp .env.tmp.XXXXXX)"

  awk -v tag="$new_tag" '
    BEGIN { replaced = 0 }
    /^IMAGE_TAG=/ && !replaced { print "IMAGE_TAG=" tag; replaced = 1; next }
    { print }
    END { if (!replaced) print "IMAGE_TAG=" tag }
  ' .env > "$temp_file"

  chmod --reference=.env "$temp_file" 2>/dev/null || chmod 600 "$temp_file"
  mv "$temp_file" .env
}

PREVIOUS_TAG="$(sed -n 's/^IMAGE_TAG=//p' .env | tail -n 1)"

echo "==> Validate compose configuration"
"${COMPOSE[@]}" config --quiet

echo "==> Pull image tag: $TAG"
IMAGE_TAG="$TAG" "${COMPOSE[@]}" pull frontend

if [[ -n "$PREVIOUS_TAG" && "$PREVIOUS_TAG" != "$TAG" ]]; then
  printf 'PREV_IMAGE_TAG=%s\n' "$PREVIOUS_TAG" > .image-prev
fi

set_image_tag "$TAG"

echo "==> Start frontend and wait for healthcheck"
if ! "${COMPOSE[@]}" up -d --no-deps --wait --wait-timeout 90 frontend; then
  if [[ -n "$PREVIOUS_TAG" && "$PREVIOUS_TAG" != "$TAG" ]]; then
    echo "==> Deployment failed; rolling back to: $PREVIOUS_TAG" >&2
    set_image_tag "$PREVIOUS_TAG"
    "${COMPOSE[@]}" up -d --no-deps --wait --wait-timeout 90 frontend
  fi
  exit 1
fi

echo "==> Remove unused image layers"
docker image prune -f

"${COMPOSE[@]}" ps
echo "==> Deployment complete"
