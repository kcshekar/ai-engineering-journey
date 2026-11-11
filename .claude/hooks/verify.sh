#!/usr/bin/env bash
# Stop hook: runs this repo's fast checks when the working tree changed since the last green run.
# Exit 2 tells Claude to keep fixing (Claude Code stops after 8 blocks in a row).
# /repo-init fills CHECKS; each line is "<path regex>=><command>", run from the repo root.
CHECKS=(
  '\.(ts|tsx)$|tsconfig\.json$=>npx tsc --noEmit'
)
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
input=$(cat)
first_stop=$(printf '%s' "$input" | python3 -c 'import json,sys; print("no" if json.load(sys.stdin).get("stop_hook_active") else "yes")' 2>/dev/null || echo yes)

changed=$( { git diff --name-only HEAD; git ls-files --others --exclude-standard; } 2>/dev/null | sort -u)
[ -z "$changed" ] && exit 0
state="$(git rev-parse --git-dir)/claude-verify-ok"
hash=$( { git diff HEAD; git ls-files --others --exclude-standard | xargs cat 2>/dev/null; } | git hash-object --stdin)
[ -f "$state" ] && [ "$(cat "$state")" = "$hash" ] && exit 0

# Test tampering: flagged once per stop so Claude must explain it to the user.
if [ "$first_stop" = yes ]; then
  deleted=$(git diff --diff-filter=D --name-only HEAD | grep -E '\.(test|spec)\.|(^|/)tests?/')
  skipped=$(git diff -U0 HEAD | grep -E '^\+.*(\.skip\(|\.only\(|\bxit\(|\bxdescribe\(|@pytest\.mark\.skip)')
  config=$(printf '%s\n' "$changed" | grep -E '(^|/)(tsconfig[^/]*\.json|biome\.jsonc?|eslint\.config\.[a-z]+|\.eslintrc[^/]*|vitest\.config\.[a-z]+|jest\.config\.[a-z]+|bunfig\.toml|pyproject\.toml|ruff\.toml)$')
  if [ -n "$deleted$skipped$config" ]; then
    echo "verify: tests were deleted or skipped, or check config changed. Fix the code, not the checks; if it is intended, tell the user why:" >&2
    printf '%s\n' "$deleted" "$skipped" "$config" | sed '/^$/d' >&2
    exit 2
  fi
fi

log=$(mktemp)
for entry in "${CHECKS[@]}"; do
  pattern=${entry%%=>*}; cmd=${entry#*=>}
  printf '%s\n' "$changed" | grep -qE "$pattern" || continue
  if ! bash -c "$cmd" >"$log" 2>&1; then
    echo "verify failed: $cmd" >&2; tail -40 "$log" >&2; rm -f "$log"; exit 2
  fi
done
rm -f "$log"
echo "$hash" > "$state"
exit 0
