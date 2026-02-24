# Temp - GitHub Branch Protection Setup

But: bloquer les merges non controles sur les branches de release.

## Branches a proteger

- `cep/val`
- `cep/prod`
- `cffe/prod`
- `dgcs/prod`
- `legacy/evaluations/cep/prod`
- `legacy/evaluations/cffe/prod`
- `legacy/evaluations/dgcs/prod`
- `legacy/reception/cep/prod`

## Etapes GitHub (a faire pour chaque branche)
1. Repo GitHub -> `Settings`.
2. `Branches` -> `Add branch protection rule`.
3. `Branch name pattern`: mettre la branche exacte (ex: `cep/prod`).
4. Cocher `Require a pull request before merging`.
5. Cocher `Require approvals` et mettre `1`.
6. Cocher `Require status checks to pass before merging`.
7. Dans les checks requis, selectionner `Node.js CI / build`.
8. Cocher `Require branches to be up to date before merging`.
9. Verifier que `Allow force pushes` est desactive.
10. Verifier que `Allow deletions` est desactive.
11. Enregistrer.

## Controle rapide apres setup
- Ouvrir une PR de test vers `cep/val`.
- Verifier que le check CI est obligatoire.
- Verifier qu'un push direct sur `cep/val`/`cep/prod` est bloque.
