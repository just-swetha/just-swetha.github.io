#!/bin/bash
# Download an image from a URL and save it to /images/ at the repo root.
# Run from anywhere inside the repo.
#
# Usage: ./boutique/save-image.sh <image-url> <filename>
# Example: ./boutique/save-image.sh https://example.com/photo.jpg dress-010.jpg

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <image-url> <filename>"
  echo "Example: $0 https://example.com/photo.jpg dress-010.jpg"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT="$REPO_ROOT/images/$2"

echo "Downloading $1"
curl -L --silent --show-error -o "$OUTPUT" "$1"
echo "Saved to $OUTPUT"
