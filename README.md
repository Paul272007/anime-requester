# Anime Requester 🎬

[![CI Lint and Format](https://github.com/Paul272007/anime-requester/actions/workflows/ci.yml/badge.svg)](https://github.com/Paul272007/anime-requester/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Anime Requester** est une application web moderne et responsive permettant de rechercher et d'explorer une vaste base de données d'animes via l'API **Tenrai API v1** (`https://api.tenrai.org/v1`, compatible Jikan v4 / MyAnimeList).

Ce projet a été développé dans le cadre d'un projet de groupe en JavaScript, axé sur la manipulation du DOM, les requêtes HTTP asynchrones, l'accessibilité WCAG AA et les bonnes pratiques de développement (tests unitaires, CI/CD, linting, formatage).

---

## 🌟 Fonctionnalités

- **Recherche multicritère :**
  - Par **titre**
  - Par **identifiant** unique (`MAL ID`)
  - Par **classement** (`Ranking`)
  - Par **genre** (en français, en anglais ou par identifiant)
  - Par **auteur**
  - Par **année de sortie**
- **Affichage conditionnel :**
  - **Recherche classique :** limitée à **10 résultats maximum** pour un affichage lisible et performant.
  - **Recherche par ID ou classement :** affichage d'un **résultat unique et ciblé**.
- **Cartes d'anime détaillées :**
  - Titre de l'œuvre
  - Affiche / Image de couverture (avec image de remplacement SVG accessible si indisponible)
  - Synopsis complet
  - Genres associés
  - Classement officiel
  - Nombre d'épisodes
- **Gestion de la clé API :**
  - Fonctionnement immédiat sans clé obligatoire grâce à l'API publique Tenrai v1.
  - Possibilité pour l'utilisateur de saisir et stocker une clé en `sessionStorage`.
  - Bouton permettant de masquer / afficher la clé saisie.
- **Réinitialisation en un clic :**
  - Bouton **Effacer** réinitialisant les filtres du formulaire et vidant immédiatement les résultats affichés tout en préservant la clé stockée en session.
- **Accessibilité & Design :**
  - Structure HTML sémantique conforme WCAG AA 2.0 (`aria-live`, `role="alert"`, textes alternatifs).
  - Design moderne, responsive et adaptatif grâce aux variables CSS.

---

## 🛠 Stack Technique

- **Langages :** HTML5 sémantique, CSS3 (Custom Properties / Flexbox & Grid), JavaScript (ES6+ Modules natifs)
- **Client HTTP :** [Axios](https://axios-http.com/) (chargé via ESM `importmap`)
- **API distante :** [Tenrai API v1](https://api.tenrai.org/v1)
- **Qualité de code :**
  - [ESLint](https://eslint.org/) (Flat Config)
  - [Prettier](https://prettier.io/)
  - [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged) pour les hooks pre-commit
- **Tests :** Test runner natif Node.js (`node:test`, `node:assert`) avec [JSDOM](https://github.com/jsdom/jsdom)
- **Intégration Continue (CI) :** GitHub Actions (validation linter, Prettier et exécution des tests unitaires à chaque push et PR)

---

## 📂 Architecture du Projet

```text
anime-requester/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Modèles d'issues (bug, feature, tâche)
│   ├── workflows/
│   │   └── ci.yml               # Pipeline d'intégration continue GitHub Actions
│   └── pull_request_template.md # Template standardisé de Pull Request
├── .husky/                      # Configuration des hooks Git pre-commit
├── css/
│   ├── style.css                # Styles principaux et mise en page responsive
│   └── variables.css            # Variables globales (couleurs, typographie, espacements)
├── js/
│   ├── animeApi.js              # Fonctions de requêtes vers Tenrai API v1 (Axios) et normalisation
│   ├── apiKeyStorage.js         # Gestion du stockage de la clé API en sessionStorage
│   ├── authorSearch.js          # Résolution et recherche d'œuvres par auteur
│   ├── cardRenderer.js          # Rendu DOM des cartes et logique d'affichage conditionnel
│   └── searchController.js      # Contrôleur d'événements du formulaire et liaison UI/API
├── tests/
│   ├── animeApi.test.js         # Tests unitaires du client API et de la normalisation
│   ├── apiKeyStorage.test.js    # Tests unitaires du stockage de la clé API
│   ├── authorSearch.test.js     # Tests unitaires de la recherche par auteur
│   ├── cardRenderer.test.js     # Tests unitaires du rendu DOM et de l'affichage
│   └── searchController.test.js # Tests unitaires du contrôleur et de la gestion d'événements
├── index.html                   # Page principale de l'application
├── package.json                 # Scripts NPM et dépendances de développement
└── README.md                    # Documentation du projet
```

---

## 🚀 Installation et Utilisation

### Prérequis

- [Node.js](https://nodejs.org/) (version 20 LTS ou supérieure recommandée)
- [npm](https://www.npmjs.com/)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Paul272007/anime-requester.git
cd anime-requester
```

### 2. Installer les dépendances

```bash
npm install
# ou
npm ci
```

### 3. Lancer l'application en local

Vous pouvez démarrer le serveur local avec :

```bash
npm run dev
# ou
npx serve .
```

Puis ouvrez votre navigateur à l'adresse indiquée (par défaut : `http://localhost:3000`).

---

## 🧪 Tests et Qualité de Code

Le projet intègre un ensemble de scripts automatisés pour garantir la qualité du code :

| Commande                 | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `npm run dev`            | Démarre un serveur HTTP local via `npx serve .`                                    |
| `npm test`               | Exécute la suite de tests unitaires (42 tests) via le test runner natif de Node.js |
| `npm run lint`           | Vérifie la conformité du code avec ESLint                                          |
| `npm run format`         | Applique le formatage automatique avec Prettier                                    |
| `npx prettier --check .` | Vérifie que l'ensemble des fichiers respecte le style Prettier                     |

---

## 👥 Auteurs & Licence

Projet développé par l'équipe **Anime Requester**.

Distribué sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.
