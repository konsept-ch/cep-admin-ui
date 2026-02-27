# Temp - Release Runs Note (CEP Admin)

## Observation
On a observe 2 runs `Docker Publish` pour la meme release/tag (`admin-cep-v2.1.7-rc.1`).

## Impact
- Si les 2 runs finissent en succes sur le meme tag, l'image finale attendue est la meme.
- Ce n'est pas bloquant pour deployer sur Jelastic.

## Action immediate
- Garder un seul run si besoin (annuler le duplicate).
- Deployer Jelastic avec le tag qui a termine en succes.

## Statut actuel
- Release/tag OK
- Deploiement Jelastic VAL CEP Admin OK
- Le lien GitHub -> Jelastic CEP Admin est considere valide.
- Incident `apt` observe puis rerun OK (echec reseau transitoire).

## Action ulterieure (optionnelle)
- Ajouter une regle de concurrence dans `.github/workflows/docker-publish.yml`
  pour eviter les doubles runs sur le meme tag.
