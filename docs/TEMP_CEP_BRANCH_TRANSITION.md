# Temp - CEP Transition Note (Admin)

Current decision:
- Keep CEP workflow only in this repository.
- Working branches: `main`, `cep/val`, `cep/prod`.
- No branch deletion at this stage.

Boundary:
- `evaluations` and `reception` are separate repositories and are not managed from this repo.

Immediate actions:
1. Keep branch protections on `cep/val` and `cep/prod`.
2. Continue release cycle through RC tags on `cep/val`, final tags on `cep/prod`.
3. Postpone cleanup/removal of old branches until migration sign-off.
