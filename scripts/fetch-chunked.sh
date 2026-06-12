#!/bin/zsh
# Run fetch-assets in chunks of 20 so a mid-run death only loses the current chunk.
# Idempotent guards in fetch-assets keep already-downloaded images. zsh-safe (array, no word-split).
set -e
cd "$(dirname "$0")/.."
isos=("${(@f)$(cat /tmp/all-isos.txt)}")
total=${#isos[@]}
chunk=20
i=1
while (( i <= total )); do
  end=$(( i + chunk - 1 ))
  (( end > total )) && end=$total
  slice=("${(@)isos[i,end]}")
  echo "=== chunk $i..$end / $total ==="
  npx tsx scripts/fetch-assets.ts "${slice[@]}" 2>&1 | grep -E "processed|gap|fail|MISS" || true
  i=$(( end + 1 ))
done
echo "=== ALL CHUNKS DONE ==="
