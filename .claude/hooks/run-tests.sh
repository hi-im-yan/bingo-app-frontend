#!/bin/bash
# Runs test suite when a feature task is marked as completed
# Detects vitest or jest from package.json

INPUT=$(cat)
NEW_STATUS=$(echo "$INPUT" | jq -r '.tool_input.status // empty')

# Only run when a task is marked completed
if [[ "$NEW_STATUS" != "completed" ]]; then
	exit 0
fi

if [ ! -f "package.json" ]; then
	exit 0
fi

# Detect test runner from package.json
if grep -q '"vitest"' package.json 2>/dev/null; then
	npx vitest run --reporter=verbose 2>&1
	exit $?
elif grep -q '"jest"' package.json 2>/dev/null || grep -q '"react-scripts"' package.json 2>/dev/null; then
	npx jest --verbose 2>&1
	exit $?
fi

# No test runner found, skip silently
exit 0
