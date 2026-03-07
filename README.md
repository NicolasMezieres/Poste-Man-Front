# PosteMan

<div style="display:flex;justify-content:center">
    <image src="public/assets/posteman.webp" alt="logo"/>
</div>

## Description

Posteman est une application facilitant la collaboration d'un groupe de personnes pour organiser un projet, une tâche ou un événement.

Chaque projet contient :

- Une messagerie en temps réel
- Des sections pour catégoriser les thèmes
- Des posts pour proposer des idées ou des tâches

Le créateur du projet peut :

- Supprimer des posts et des messages
- Exclure ou bannir les membres du projet

## Aperçu
Aperçu des messages :

<image src="public/assets/docs/message.webp" style="width:300px"/>

Aperçu des posts:

<image src="public/assets/docs/post.webp" style="width:300px">

## Stack

- Node.js >= 20 (22 recommandé)
- Framework Angular 20
- TailwindCSS
- Docker

## Installation

### Prérequis :

- Docker Desktop
- Git

### Cloner le repo

git clone url
cd Poste-man

## Lancement

Prerequis :

- Lancer Docker Desktop

```bash
docker compose build

docker compose up --watch
```
## Développement 

### Prérequis

- Node.JS >= 20 (22 recommandé)

### Initialisation

```bash
npm i
```

## Lancement des tests unitaires

```bash
# Tests unitaires
npm run test

# Couverture des tests unitaires
npm run test:cov
```

## L'API

Le backend du projet est disponible ici : https://github.com/NicolasMezieres/Poste-man-Back
