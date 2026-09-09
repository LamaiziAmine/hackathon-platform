# 🏛️ Plateforme de Gestion des Hackathons Institutionnels

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.x-blue.svg)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38b2ac.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

---

## 📌 1. Présentation du Projet

Ce projet consiste en la conception et la réalisation d'une **plateforme moderne et modulaire pour l'organisation et la gestion de hackathons technologiques**.

Conçue selon les standards industriels et les architectures d'entreprise modernes, l'application repose sur une **architecture distribuée orientée microservices (Spring Cloud)** couplée à un **frontend réactif (React & Tailwind CSS)**. Elle permet la publication de défis, la gestion des inscriptions/candidatures, l'encadrement des équipes par des mentors, ainsi que le dépôt et l'évaluation des livrables de projets.

---

## 🎯 2. Objectifs Pédagogiques & Fonctionnels

- **Découplage & Scalabilité** : Séparation stricte des domaines fonctionnels au sein de microservices indépendants.
- **Sécurité Centralisée** : Gestion de l'authentification et des autorisations via JSON Web Tokens (JWT) et filtrage au niveau de la Gateway.
- **Service Discovery & Load Balancing** : Découverte automatique des services avec Netflix Eureka et routage dynamique.
- **Expérience Utilisateur Moderne** : Interface soignée, réactive et fluide adaptée aux candidats, mentors et organisateurs.
- **Gestion des Fichiers & Livrables** : Upload et persistance sécurisés des pièces jointes et rendus de projets.

---

## 🏗️ 3. Architecture Globale du Système

### 3.1 Vue d'Ensemble de l'Architecture
Le système adopte le pattern **API Gateway / Service Registry** :

```text
               +-------------------------------------------------+
               |             Client Web (React 19 / Vite)        |
               +-------------------------------------------------+
                                        │
                                        ▼ (HTTP / REST)
               +-------------------------------------------------+
               |       API Gateway (Spring Cloud Gateway :8080)   |
               |       - Filtre d'authentification JWT           |
               |       - Routage dynamique & CORS                |
               +-------------------------------------------------+
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 │ (Discovery & Lookup) │                      │
                 ▼                      │                      ▼
     +-----------------------+          │          +-----------------------+
     | Eureka Discovery      |          │          | MySQL Databases       |
     | Server (:8761)        |          │          | (db_identity,         |
     +-----------------------+          │          |  db_hackathon,        |
                                        │          |  db_participant,      |
     ┌──────────────────┬───────────────┼──────────┤  db_application,      |
     │                  │               │          |  db_team,             |
     ▼                  ▼               ▼          |  db_deliverable)      |
+-------------+  +-------------+  +-------------+  +-----------------------+
|  Identity   |  |  Hackathon  |  | Participant |             ▲
|   Service   |  |   Service   |  |   Service   |             │
|   (:8081)   |  |   (:8082)   |  |   (:8084)   |─────────────┤
+-------------+  +-------------+  +-------------+             │
     │                  │               │                     │
     ▼                  ▼               ▼                     │
+-------------+  +-------------+  +-------------+             │
| Application |  |    Team     |  | Deliverable |             │
|   Service   |  |   Service   |  |   Service   |─────────────┘
|   (:8083)   |  |   (:8085)   |  |   (:8086)   |
+-------------+  +-------------+  +-------------+
```

---

## 🧩 4. Description Détaillée des Modules

### 4.1 Infrastructure (`/infra`)

| Composant | Port | Description & Responsabilités |
|---|:---:|---|
| **Discovery Server (Eureka)** | `8761` | Annuaire et registre de découverte des microservices (Netflix Eureka). |
| **API Gateway** | `8080` | Point d'entrée unique (`Spring Cloud Gateway`), gestion globale des CORS et interception des requêtes sécurisées via `AuthenticationFilter` (validation JWT). |

### 4.2 Services Métier (`/services`)

| Service | Port | Base de Données | Responsabilités |
|---|:---:|:---:|---|
| **Identity Service** | `8081` | `db_identity` | Inscription, connexion, génération des jetons JWT sécurisés et gestion des rôles (`ADMIN`, `PARTICIPANT`, `MENTOR`). |
| **Hackathon Service** | `8082` | `db_hackathon` | Gestion du cycle de vie des hackathons (création, publication, thématiques, dates, localisation, statut). |
| **Application Service** | `8083` | `db_application` | Gestion des candidatures des participants aux hackathons et téléversement des pièces justificatives (jusqu'à 10MB). |
| **Participant Service** | `8084` | `db_participant` | Profils complets des participants (coordonnées, bio, compétences techniques). |
| **Team Service** | `8085` | `db_team` | Formation des équipes pour un hackathon donné et affectation/suivi des mentors encadrants. |
| **Deliverable Service** | `8086` | `db_deliverable` | Définition des exigences de livrables, soumission des fichiers de projets par les équipes (jusqu'à 50MB) et horodatage. |

### 4.3 Client Frontend (`/frontend/hackathon-ui`)

- **Framework** : React 19 avec Vite
- **Styling** : Tailwind CSS v4 & Lucide React (icônes modernes)
- **Routage & Navigation** : React Router v7
- **Communication HTTP** : Axios (avec intercepteurs pour l'injection automatique du JWT)
- **Vues principales** :
  - **Accueil / Hero** : Présentation institutionnelle des défis et événements.
  - **Hackathons** : Liste interactive avec filtres par statut et détails des thèmes.
  - **Formulaire de Candidature** : Postulation en ligne avec téléversement de documents.
  - **Authentification** : Pages de connexion (`Login`) et d'inscription (`Register`).

---

## 🛠️ 5. Stack Technologique

### Backend & Infrastructure
- **Langage** : Java 17 / 21
- **Framework** : Spring Boot 3.x, Spring Cloud (Gateway, Netflix Eureka Client & Server)
- **Sécurité** : Spring Security, JSON Web Token (JWT `io.jsonwebtoken`)
- **Persistance & ORM** : Spring Data JPA, Hibernate, MySQL Driver
- **Outil de Build** : Apache Maven

### Frontend
- **Langage / Environnement** : JavaScript (ES Modules), Node.js
- **Framework & Outils** : React 19, Vite 8, PostCSS
- **Style** : Tailwind CSS v4
- **Composants d'icônes** : Lucide React

### Bases de Données & Stockage
- **SGBD Relationnel** : MySQL 8.0 (schémas indépendants par microservice)
- **Stockage Fichiers** : Système de fichiers local (uploads multipart)

---

## 🚀 6. Guide d'Installation et de Démarrage

### 6.1 Prérequis Système
- **JDK** : Version 17 ou supérieure installée et configurée (`JAVA_HOME`)
- **Node.js** : Version 18 ou supérieure & `npm`
- **MySQL** : Instance locale en cours d'exécution sur le port standard `3306` (utilisateur `root`, sans mot de passe ou avec mot de passe configuré dans les fichiers `.properties` / `.yml`)
- **Maven** : Maven 3.8+ (ou utilisation des wrappers Maven)

---

### 6.2 Démarrage des Microservices Backend

> ⚠️ **Important : Respecter scrupuleusement l'ordre de démarrage ci-dessous !**

#### Étape 1 : Démarrer le Service Registry (Eureka)
```bash
cd infra/discovery-server
mvn spring-boot:run
```
*Vérification : Accéder à l'interface Eureka sur [http://localhost:8761](http://localhost:8761)*

#### Étape 2 : Démarrer les Services Métier
Dans des terminaux séparés :
```bash
# Identity Service (8081)
cd services/identity-service
mvn spring-boot:run

# Hackathon Service (8082)
cd services/hackathon-service
mvn spring-boot:run

# Participant Service (8084)
cd services/participant-service
mvn spring-boot:run

# Application Service (8083)
cd services/application-service
mvn spring-boot:run

# Team Service (8085)
cd services/team-service
mvn spring-boot:run

# Deliverable Service (8086)
cd services/deliverable-service
mvn spring-boot:run
```

#### Étape 3 : Démarrer l'API Gateway
```bash
cd infra/api-gateway
mvn spring-boot:run
```
*L'API Gateway est désormais accessible sur [http://localhost:8080](http://localhost:8080)*

---

### 6.3 Démarrage du Frontend React

```bash
cd frontend/hackathon-ui
npm install
npm run dev
```
*L'application Web est accessible sur [http://localhost:5173](http://localhost:5173)*

---

## 📡 7. Points d'Accès Principaux (API Endpoints)

Toutes les requêtes passent par l'**API Gateway** (`http://localhost:8080`) :

| Méthode | Endpoint | Description | Authentification requise |
|---|---|---|:---:|
| `POST` | `/auth/register` | Inscription d'un nouvel utilisateur | ❌ Non |
| `POST` | `/auth/token` | Connexion et obtention du Bearer JWT | ❌ Non |
| `GET` | `/hackathons` | Récupération de la liste des hackathons | ❌ Non |
| `POST` | `/hackathons` | Création d'un nouvel hackathon | 🔒 Oui (Bearer) |
| `POST` | `/applications` | Dépôt d'une candidature avec documents | 🔒 Oui (Bearer) |
| `POST` | `/participants` | Création / Mise à jour du profil participant | 🔒 Oui (Bearer) |
| `POST` | `/teams` | Création d'une nouvelle équipe | 🔒 Oui (Bearer) |
| `PATCH` | `/teams/{teamId}/assign-mentor/{mentorId}` | Affectation d'un mentor à une équipe | 🔒 Oui (Bearer) |
| `GET` | `/teams/mentor/{mentorId}` | Récupération des équipes d'un mentor | 🔒 Oui (Bearer) |
| `POST` | `/deliverables/submissions` | Dépôt d'un livrable par une équipe | 🔒 Oui (Bearer) |

---

## 🔒 8. Sécurité et Gestion des Rôles

- **Génération des Tokens** : Chiffrement symétrique avec algorithme HMAC (clé secrète configurable).
- **Filtrage Gateway** : Le composant `AuthenticationFilter` valide l'intégrité et la validité temporelle des tokens JWT avant d'acheminer la requête aux services sous-jacents.
- **CORS** : Configuration centralisée permettant l'interopérabilité fluide entre l'application React et l'écosystème Spring Cloud.

---

## 📂 9. Structure du Répertoire Projet

```text
hackathon-platform/
├── infra/
│   ├── api-gateway/            # Passerelle d'API Spring Cloud Gateway (Routage + Sécurité)
│   └── discovery-server/       # Serveur d'enregistrement Netflix Eureka
├── services/
│   ├── identity-service/       # Gestion des utilisateurs et JWT
│   ├── hackathon-service/      # Gestion et publication des hackathons
│   ├── participant-service/    # Gestion des profils de participants
│   ├── application-service/    # Gestion des candidatures et fichiers
│   ├── team-service/           # Gestion des équipes et mentors
│   └── deliverable-service/    # Gestion des livrables et dépôts de projets
├── frontend/
│   └── hackathon-ui/           # Application Web React (Vite, Tailwind CSS)
├── test-auth.http              # Fichier de tests REST HTTP
└── README.md                   # Documentation technique du projet
```

---

## 👨‍💻 Réalisé par
Amine Lamaizi - Software Engineer Student 
