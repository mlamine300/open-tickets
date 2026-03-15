<p align="center">
  <a href="https://open-tickets-sandy.vercel.app/" target="_blank">
    <img src="https://ik.imagekit.io/rt2d2ljwz/banner%20open%20ticket%20pour%20github%202.png" alt="OpenTickets Banner" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-3FA037?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Security-blue?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<h2 align="center">🚀 Plateforme Complète de Gestion des Réclamations</h2>

<p align="center">
Une application moderne construite avec la <strong>stack MERN</strong> pour gérer efficacement les réclamations entre les agences et les services d'une entreprise.
</p>

---

# ✨ Fonctionnalités principales

## 🎫 Gestion des tickets

* Création et suivi des réclamations
* Attribution des tickets aux services
* Gestion du statut des tickets
* Historique des actions

## 🏢 Gestion des organisations

* Gestion des agences
* Gestion des services
* Attribution des utilisateurs par organisation

## 📝 Formulaires personnalisés

* Création de formulaires dynamiques
* Personnalisation des champs
* Catégorisation des réclamations

## 📊 Tableaux de bord

* Statistiques des réclamations
* Rapports détaillés
* Analyse des performances par service

## 🔒 Sécurité

* Authentification sécurisée avec JWT
* Hashage des mots de passe avec bcrypt
* Protection des routes API

---

# 🧰 Stack Technique

| Couche              | Technologie         |
| ------------------- | ------------------- |
| **Frontend**        | React, Context API  |
| **Backend**         | Node.js, Express.js |
| **Base de données** | MongoDB, Mongoose   |
| **Sécurité**        | JWT, bcrypt         |
| **UI**              | CSS moderne         |
| **Déploiement**     | Vercel              |

---

# 🖼️ Aperçu de l'application

L'application permet de centraliser la gestion des réclamations entre les agences et les services internes d'une entreprise.

Fonctionnalités visuelles :

* Dashboard avec statistiques
* Création de tickets
* Gestion des organisations
* Formulaires personnalisés
* Rapports analytiques

---

# 🗂️ Structure du projet

```
open-tickets/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── public/
│
└── README.md
```

---

# ⚙️ Installation & Configuration

## 1️⃣ Cloner le repository

```
git clone https://github.com/mlamine300/open-tickets.git
```

---

## 2️⃣ Installer le backend

```
cd open-tickets/backend
npm install
```

---

## 3️⃣ Installer le frontend

```
cd ../frontend
npm install
```

---

## 4️⃣ Configurer les variables d'environnement

Créer un fichier `.env` dans **backend/**

```
MONGODB_URI=votre_url_mongodb
JWT_SECRET=votre_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## 5️⃣ Lancer l'application

### Backend

```
npm run dev
```

### Frontend

```
npm start
```

---

# 🚀 Démo en ligne

Tester l'application ici :

https://open-tickets-sandy.vercel.app/

---

# 🛣️ Roadmap

Améliorations futures :

* Notifications en temps réel
* Mode sombre
* Gestion avancée des rôles
* Commentaires sur les tickets
* Export des rapports

---

# 👤 Auteur

**Lamine Laoufi**

GitHub :
https://github.com/mlamine300

---

# 📄 Licence

MIT License — libre d'utilisation, modification et distribution.
