#!/bin/bash
# Blocks Edit/Write if XSS-prone patterns are being added
# Catches dangerouslySetInnerHTML (React) and v-html (Vue)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only check frontend source files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx && "$FILE_PATH" != *.js && "$FILE_PATH" != *.jsx && "$FILE_PATH" != *.vue ]]; then
	exit 0
fi

# For Edit: check new_string. For Write: check content
if [[ "$TOOL" == "Edit" ]]; then
	NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
elif [[ "$TOOL" == "Write" ]]; then
	NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
else
	exit 0
fi

# Check for React XSS pattern
if echo "$NEW_CONTENT" | grep -q 'dangerouslySetInnerHTML'; then
	echo "Blocked: dangerouslySetInnerHTML is an XSS risk. Use a sanitizer (DOMPurify) or render safe content via JSX" >&2
	exit 2
fi

# Check for Vue XSS pattern
if echo "$NEW_CONTENT" | grep -q 'v-html'; then
	echo "Blocked: v-html is an XSS risk. Use v-text, template interpolation {{ }}, or sanitize with DOMPurify" >&2
	exit 2
fi

# Check for direct innerHTML assignment
if echo "$NEW_CONTENT" | grep -qE '\.innerHTML\s*='; then
	echo "Blocked: Direct innerHTML assignment is an XSS risk. Use textContent or a sanitizer (DOMPurify)" >&2
	exit 2
fi

exit 0
