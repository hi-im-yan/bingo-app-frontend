#!/bin/bash
# Runs test runner after Edit/Write on frontend source files
# Detects vitest or jest from package.json

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run for TS/TSX/JS/JSX/Vue files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx && "$FILE_PATH" != *.js && "$FILE_PATH" != *.jsx && "$FILE_PATH" != *.vue ]]; then
	exit 0
fi

# Skip config files
BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == *.config.* || "$BASENAME" == *.d.ts ]]; then
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
