# F5.1 — Dockerfile + CI/CD

**Status:** blocked
**Blocked by:** F4.3 (e2e-tests)
**Branch:** feature/dockerfile-cicd

## Description
New Dockerfile for Next.js 16 (multi-stage build, standalone output). Update GitHub Actions workflow. Environment variable configuration for prod.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Create multi-stage Dockerfile | ready | — | Component Builder |
| 002 | Update GitHub Actions workflow | ready | — | Component Builder |
| 003 | Document env var configuration | ready | 001, 002 | Component Builder |

## Decisions
- Next.js standalone output mode for minimal Docker image
- Multi-stage build: deps → build → runtime
- Same deploy flow: Docker Hub → Render webhook
