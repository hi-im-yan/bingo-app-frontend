#!/bin/bash
# PostToolUse hook: runs ESLint --fix on modified frontend files
# Auto-fixes formatting and simple lint issues after edits

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only process frontend source files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx && "$FILE_PATH" != *.js && "$FILE_PATH" != *.jsx && "$FILE_PATH" != *.vue ]]; then
	exit 0
fi

# Skip if file doesn't exist
if [ ! -f "$FILE_PATH" ]; then
	exit 0
fi

# Skip config and declaration files
BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == *.config.* || "$BASENAME" == *.d.ts ]]; then
	exit 0
fi

if [ ! -f "package.json" ]; then
	exit 0
fi

# Run ESLint fix if available
if grep -q '"eslint"' package.json 2>/dev/null || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc.yml" ]; then
	npx eslint --fix "$FILE_PATH" 2>&1
	exit $?
fi

exit 0
