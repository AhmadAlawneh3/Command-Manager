#!/usr/bin/env bash
# verify-syntax.sh — sanity-check that flags used in command JSON files still
# exist in the upstream tool's --help output. Runs each tool inside Docker so
# you don't need a full pentest toolbox installed locally.
#
# Usage:  scripts/verify-syntax.sh [tool]
#         scripts/verify-syntax.sh           # checks all tools below
#         scripts/verify-syntax.sh nxc       # only NetExec
#
# Exit code is the number of drift findings (0 = clean).

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CMDS="$ROOT/commands"
DRIFT=0

# tool name | docker image | help cmd | json glob
TOOLS=(
  "nxc|ghcr.io/pennyw0rth/netexec:latest|nxc --help|$CMDS/**/nxc-*.json"
  "certipy|oddvarmoe/certipy:latest|certipy --help|$CMDS/**/certipy-*.json"
  "bloodyAD|cravaterouge/bloodyad:latest|bloodyAD --help|$CMDS/**/bloodyad-*.json"
  "impacket|rflathers/impacket:latest|impacket-secretsdump --help|$CMDS/**/impacket-*.json"
)

check_tool() {
  local name="$1" image="$2" helpcmd="$3" glob="$4"
  echo "==> $name ($image)"
  local help
  help=$(docker run --rm "$image" sh -c "$helpcmd" 2>&1) || {
    echo "  ! could not run $image — skipping"; return
  }
  shopt -s globstar nullglob
  for f in $glob; do
    # extract long flags (--foo) from the command field
    local flags
    flags=$(grep -oE '\-\-[a-zA-Z][a-zA-Z0-9-]+' "$f" | sort -u)
    for flag in $flags; do
      if ! grep -qF -- "$flag" <<<"$help"; then
        echo "  DRIFT  $(basename "$f")  $flag not in --help"
        DRIFT=$((DRIFT+1))
      fi
    done
  done
}

if [[ $# -gt 0 ]]; then
  for entry in "${TOOLS[@]}"; do
    IFS='|' read -r n i h g <<<"$entry"
    [[ "$n" == "$1" ]] && check_tool "$n" "$i" "$h" "$g"
  done
else
  for entry in "${TOOLS[@]}"; do
    IFS='|' read -r n i h g <<<"$entry"
    check_tool "$n" "$i" "$h" "$g"
  done
fi

echo
echo "Total drift findings: $DRIFT"
exit $DRIFT
