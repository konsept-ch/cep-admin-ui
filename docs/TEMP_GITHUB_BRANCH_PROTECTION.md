# Temp - CEP Branch Protection (Admin)

## Scope
Apply protection only on:
- `cep/val`
- `cep/prod`

Do not apply this document to `evaluations` / `reception` (separate repos).

## Required settings
- Require pull request before merging
- Required approvals: 1
- Require status checks to pass
- Required check: `Node.js CI / build`
- Require branches to be up to date
- Block force pushes
- Restrict deletions
- Require linear history

## Quick validation
- Open PR to `cep/val`
- Confirm merge is blocked until CI is green
