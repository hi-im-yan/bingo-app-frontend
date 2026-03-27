#!/bin/bash
# Stop hook: verifies test coverage threshold for frontend projects
# Only runs when frontend source files were modified

if [ ! -f "package.json" ]; then
	exit 0
fi

# Check if any frontend files were modified
FE_CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx|vue)$' || git diff --name-only 2>/dev/null | grep -E '\.(ts|tsx|js|jsx|vue)$')
if [ -z "$FE_CHANGED" ]; then
	exit 0
fi

# Detect test runner and run coverage
if grep -q '"vitest"' package.json 2>/dev/null; then
	OUTPUT=$(npx vitest run --coverage --reporter=verbose 2>&1)
	TEST_EXIT=$?
elif grep -q '"jest"' package.json 2>/dev/null; then
	OUTPUT=$(npx jest --coverage --verbose 2>&1)
	TEST_EXIT=$?
else
	# No test runner found
	exit 0
fi

if [ $TEST_EXIT -ne 0 ]; then
	echo "TEST FAILURE:" >&2
	echo "$OUTPUT" | tail -30 >&2
	exit 1
fi

# Check coverage from summary line (works for both vitest and jest)
# Look for "All files" line in coverage table: All files | XX.XX | ...
COVERAGE_LINE=$(echo "$OUTPUT" | grep -E 'All files\s*\|' | head -1)
if [ -n "$COVERAGE_LINE" ]; then
	# Extract statement coverage (second column)
	PCT=$(echo "$COVERAGE_LINE" | awk -F'|' '{gsub(/[[:space:]]/, "", $2); print int($2)}')
	if [ -n "$PCT" ] && [ "$PCT" -lt 80 ]; then
		echo "Coverage: ${PCT}% — below 80% threshold" >&2
		exit 1
	fi
	echo "Coverage: ${PCT}% — OK"
fi

exit 0
