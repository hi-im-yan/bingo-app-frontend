#!/bin/bash
# Blocks Edit/Write if hardcoded secrets or API keys are detected
# Cross-stack hook — works for any language

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Skip .env files (secrets belong there)
BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == .env* || "$BASENAME" == *.env ]]; then
	exit 0
fi

# Skip lock files, config, and non-source files
if [[ "$BASENAME" == package-lock.json || "$BASENAME" == pom.xml || "$BASENAME" == *.lock || "$BASENAME" == *.svg || "$BASENAME" == *.png ]]; then
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

# AWS keys (AKIA followed by 16 alphanumeric chars)
if echo "$NEW_CONTENT" | grep -qE 'AKIA[0-9A-Z]{16}'; then
	echo "Blocked: Possible AWS access key detected. Use environment variables instead" >&2
	exit 2
fi

# Generic API key/secret/token/password assignments with actual values
# Matches patterns like: api_key = "sk-...", token: "ghp_...", password = "..."
if echo "$NEW_CONTENT" | grep -qiE '(api[_-]?key|api[_-]?secret|secret[_-]?key|access[_-]?token|auth[_-]?token|password|credentials)\s*[:=]\s*["\x27][A-Za-z0-9+/_.~-]{20,}["\x27]'; then
	echo "Blocked: Possible hardcoded credential detected. Use environment variables instead" >&2
	exit 2
fi

# Known provider key prefixes (GitHub, Stripe, Slack, OpenAI, Anthropic, etc.)
if echo "$NEW_CONTENT" | grep -qE '(ghp_[A-Za-z0-9]{36}|sk-[A-Za-z0-9]{32,}|sk_live_[A-Za-z0-9]{24,}|xoxb-[0-9]{10,}|xoxp-[0-9]{10,}|sk-ant-[A-Za-z0-9-]{80,})'; then
	echo "Blocked: Known provider API key detected (GitHub/Stripe/Slack/OpenAI/Anthropic). Use environment variables instead" >&2
	exit 2
fi

# Private keys
if echo "$NEW_CONTENT" | grep -q 'BEGIN.*PRIVATE KEY'; then
	echo "Blocked: Private key detected. Never hardcode private keys in source files" >&2
	exit 2
fi

exit 0
