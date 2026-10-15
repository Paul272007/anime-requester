# Anime Requester 🎬

[![CI Lint and Format](https://github.com/Paul272007/anime-requester/actions/workflows/ci.yml/badge.svg)](https://github.com/Paul272007/anime-requester/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Anime Requester** est une application web moderne et responsive permettant de rechercher et d'explorer une vaste base de données d'animes via l'API **Anime DB** de RapidAPI.

Ce projet a été développé dans le cadre d'un projet de groupe en JavaScript, axé sur la manipulation du DOM, les requêtes HTTP asynchrones, l'accessibilité WCAG AA et les bonnes pratiques de développement (tests unitaires, CI/CD, linting, formatage).

---

## 🌟 Fonctionnalités

- **Recherche multicritère :**
  - Par **titre**
  - Par **identifiant** unique (`ID`)
  - Par **classement** (`Ranking`)
  - Par **genre**
  - Par **auteur**
  - Par **année de sortie**
- **Affichage conditionnel :**
  - **Recherche classique :** limitée à **10 résultats maximum** pour un affichage lisible et performant.
  - **Recherche par ID ou classement :** affichage d'un **résultat unique et ciblé**.
- **Cartes d'anime détaillées :**
  - Titre de l'œuvre
  - Affiche / Image de couverture (avec image de remplacement accessible si indisponible)
  - Synopsis complet
  - Genres associés
  - Classement officiel
  - Nombre d'épisodes
- **Gestion de la clé API :**
  - Utilisation d'une clé par défaut prête à l'emploi.
  - Possibilité pour l'utilisateur de saisir sa propre clé RapidAPI stockée de manière sécurisée en `sessionStorage`.
  - Bouton permettant de masquer / afficher la clé saisie.
- **Réinitialisation en un clic :**
  - Bouton **Effacer** réinitialisant le formulaire, les filtres et vidant immédiatement les résultats affichés.
- **Accessibilité & Design :**
  - Structure HTML sémantique conforme WCAG AA 2.0 (`aria-live`, `role="alert"`, textes alternatifs).
  - Design moderne, responsive et adaptatif grâce aux variables CSS.

---

## 🛠 Stack Technique

- **Langages :** HTML5 sémantique, CSS3 (Custom Properties / Flexbox & Grid), JavaScript (ES6+ Modules natifs)
- **Client HTTP :** [Axios](https://axios-http.com/) (chargé via ESM `importmap`)
- **API distante :** [Anime DB (RapidAPI)](https://rapidapi.com/brianrofiq/api/anime-db)
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
│   ├── workflows/
│   │   └── ci.yml               # Pipeline d'intégration continue GitHub Actions
│   └── pull_request_template.md # Template standardisé de Pull Request
├── .husky/                      # Configuration des hooks Git pre-commit
├── css/
│   ├── style.css                # Styles principaux et mise en page responsive
│   └── variables.css            # Variables globales (couleurs, typographie, espacements)
├── js/
│   ├── animeApi.js              # Fonctions de requêtes vers l'API Anime DB (Axios)
│   ├── apiKeyStorage.js         # Gestion du stockage de la clé API en sessionStorage
│   ├── cardRenderer.js          # Rendu DOM des cartes et logique d'affichage conditionnel
│   └── searchController.js      # Contrôleur d'événements du formulaire et liaison UI/API
├── tests/
│   ├── apiKeyStorage.test.js    # Tests unitaires du stockage de la clé API
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

Vous pouvez démarrer un serveur local léger avec `npx serve` :

```bash
npx serve .
```

Puis ouvrez votre navigateur à l'adresse indiquée (par défaut : `http://localhost:3000`).

---

## 🧪 Tests et Qualité de Code

Le projet intègre un ensemble de scripts automatisés pour garantir la qualité du code :

| Commande                 | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `npm test`               | Exécute la suite de tests unitaires (28 tests) via le test runner natif de Node.js |
| `npm run lint`           | Vérifie la conformité du code avec ESLint                                          |
| `npm run format`         | Applique le formatage automatique avec Prettier                                    |
| `npx prettier --check .` | Vérifie que l'ensemble des fichiers respecte le style Prettier                     |

---

## 🔑 Clé API RapidAPI (Optionnel)

L'application est configurée avec une clé d'accès par défaut prête à l'emploi. Si vous disposez de votre propre compte RapidAPI :

1. Créez un compte sur [RapidAPI](https://rapidapi.com/).
2. Abonnez-vous à l'API [Anime DB](https://rapidapi.com/brianrofiq/api/anime-db) (forfait gratuit disponible).
3. Renseignez votre clé personnelle dans le champ dédié sur la page d'accueil.
4. La clé est automatiquement sauvegardée dans la session de votre navigateur (`sessionStorage`).

---

## 👥 Auteurs & Licence

Projet développé par l'équipe **Anime Requester**.

Distribué sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.
