# Git / Versioning (Admin)

## Objectif
Garder un workflow simple pour deployer par tag via GitHub Release (image Docker) puis Jelastic.

## Branches officielles
Dans ce repo, on garde uniquement ces branches "longue vie":

- `cep/prod`
- `cep/val`
- `cffe/prod`
- `dgcs/prod`
- `legacy/evaluations/cep/prod`
- `legacy/evaluations/cffe/prod`
- `legacy/evaluations/dgcs/prod`
- `legacy/reception/cep/prod`

## Regles
- Ne pas developper directement sur les branches `*/prod` et `cep/val`.
- Toute feature/hotfix passe par une branche courte: `feat/...`, `fix/...`, `hotfix/...`.
- `archive` est gere par tags uniquement (pas de branche longue vie).
- Un tag publie est immutable (jamais retag/rewrite).
- Les anciennes branches (noms historiques) sont a supprimer apres migration.

## Regle de version (importante)
On attend la meme version applicative entre validation, production et archive.

- En validation: tags de pre-release `-rc.N`.
- En production: un seul tag final canonique (sans `-rc`).
- En archive: meme commit que prod (tag archive optionnel pour tracabilite).

Exemple:
- `admin-cep-v2.1.7-rc.1` (val)
- `admin-cep-v2.1.7-rc.2` (val apres correction)
- `admin-cep-v2.1.7` (final: prod + archive)
- `admin-cep-archive-v2.1.7` (optionnel, meme commit que prod)

## Flux CEP (val -> prod)
1. Creer une branche de travail depuis `cep/prod`.
2. Ouvrir PR vers `cep/val`.
3. Tester en validation.
4. Tagger en `-rc` pour deploy validation.
5. Si correction demandee, nouveau commit sur `cep/val` + nouveau tag `-rc`.
6. Quand valide, merge `cep/val` -> `cep/prod`.
7. Tagger le commit final en `admin-cep-vX.Y.Z`.
8. Deploy prod (et archive) depuis ce meme tag.

## Flux CFFE / DGCS
1. Branche de travail depuis `cffe/prod` (ou `dgcs/prod`).
2. PR vers la branche client `*/prod`.
3. Tag final sur la branche client pour deploy.

## Environnements legacy encore actifs
Ces environnements sont deployes et doivent rester tracables proprement.

- `evaluations cffe` (prod): tag historique `cffe-v.1.0.1`
- `evaluations dgcs` (prod): tag historique `dgcs-v.1.0.1`
- `evaluations cep` (prod): tag historique `v.1.0.1`
- `reception cep` (prod): tag historique `v0.0.1-beta.5`
- `cep val reception`: pointe actuellement sur `main` (a migrer vers une branche dediee)
- `cep val evaluations`: pointe actuellement sur `main` (a migrer vers une branche dediee)

Regle de transition:
- Pour les deploiements legacy, garder les tags historiques pour compatibilite.
- Creer ensuite des branches dediees `legacy/.../prod` pour ne plus deployer depuis `main`.
- Une fois stable, introduire une convention de tags normalisee sur ces branches legacy.

## Convention de tags
Format recommande:

- CEP val: `admin-cep-vX.Y.Z-rc.N`
- CEP final: `admin-cep-vX.Y.Z`
- CEP archive (optionnel): `admin-cep-archive-vX.Y.Z`
- CFFE final: `admin-cffe-vX.Y.Z`
- DGCS final: `admin-dgcs-vX.Y.Z`

## Checklist avant tag
- Branch cible correcte.
- PR mergee et pipeline verte.
- Version notee dans le changelog (si utilise) et coherente avec le tag.
- Tag annote et immutable (ne pas re-ecrire un tag publie).
