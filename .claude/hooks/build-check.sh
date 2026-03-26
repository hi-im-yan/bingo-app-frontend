#!/bin/bash
# PostToolUse hook: runs next build after editing server component files
# Catches client/server boundary violations that unit tests miss

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check page.tsx and layout.tsx inside app/ — these are server components
if [[ "$FILE_PATH" != */app/*/page.tsx && "$FILE_PATH" != */app/*/layout.tsx ]]; then
	exit 0
fi

# Skip if file has "use client" directive — it's not a server component
if head -5 "$FILE_PATH" 2>/dev/null | grep -q '"use client"'; then
	exit 0
fi

if [ ! -f "package.json" ]; then
	exit 0
fi

npm run build 2>&1
exit $?
