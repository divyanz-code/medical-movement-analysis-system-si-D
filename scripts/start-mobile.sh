#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

find_ip() {
  local ip

  ip="$(ipconfig getifaddr en0 2>/dev/null || true)"
  if [[ -n "$ip" ]]; then
    echo "$ip"
    return
  fi

  ip="$(ipconfig getifaddr en1 2>/dev/null || true)"
  if [[ -n "$ip" ]]; then
    echo "$ip"
    return
  fi

  ip="$(ifconfig | awk '/inet / {print $2}' | grep -E '^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)' | head -n1 || true)"
  if [[ -n "$ip" ]]; then
    echo "$ip"
    return
  fi

  echo ""
}

LAN_IP="$(find_ip)"
if [[ -z "$LAN_IP" ]]; then
  echo "Could not detect LAN IP automatically."
  echo "Run manually: EXPO_PUBLIC_API_BASE_URL=http://<YOUR_IP>:8000 npm run -w apps/mobile start"
  exit 1
fi

export EXPO_PUBLIC_API_BASE_URL="http://${LAN_IP}:8000"

echo "Using EXPO_PUBLIC_API_BASE_URL=${EXPO_PUBLIC_API_BASE_URL}"
cd "$ROOT_DIR"

if [[ "${1:-}" == "--tunnel" ]]; then
  npm run -w apps/mobile start -- --tunnel
else
  npm run -w apps/mobile start
fi
