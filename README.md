Ce projet met en œuvre une architecture microservices en Node.js, PostgreSQL, Docker et Kubernetes, simulée via Minikube.

---

## Technologies utilisées

- Node.js (Express)
- PostgreSQL
- Sequelize
- Docker & Docker Compose
- Kubernetes + Minikube
- Ingress NGINX
- Docker Hub

---

## Structure du projet

```
mon-projet/
├── gestion-produits/             # Microservice de gestion des produits
├── gestion-commandes/            # Microservice de gestion des commandes
├── k8s/                          # Fichiers de déploiement Kubernetes
├── docker-compose.yml            # Lance tout localement
└── README.md
```

---

## Fonctionnalités

### Microservice 1 : `gestion-produits`
- API REST : `/products`
- CRUD sur les produits
- Connecté à PostgreSQL
- Exposé sur : `http://localhost:3000` ou `http://produits.local/products`

### Microservice 2 : `gestion-commandes`
- API REST : `/orders`
- CRUD sur les commandes
- Connecté à la **même base PostgreSQL**
- Exposé sur : `http://localhost:3001` ou `http://produits.local/orders`

---

## Lancement en local (Docker Compose)

Depuis la racine du projet :
```bash
docker-compose up --build
```

Vous pouvez ensuite accéder à :
- `http://localhost:3000/products`
- `http://localhost:3001/orders`

---

## Déploiement Kubernetes (avec Minikube)

### 1. Lancer Minikube + Docker local
```bash
minikube start
eval $(minikube docker-env)
```

### 2. Builder l’image localement pour Minikube
```bash
docker build -t gestion-commandes-image:latest ./gestion-commandes
```

### 3. Appliquer les fichiers K8s
```bash
kubectl apply -f k8s/
```

### 4. Lancer un tunnel pour accéder à l’Ingress
```bash
minikube tunnel
```

### 5. Modifier `/etc/hosts`
```
127.0.0.1   produits.local
```

---

## Routage via Ingress

```yaml
rules:
  - host: produits.local
    http:
      paths:
        - path: /products
          backend: api-service
        - path: /orders
          backend: api-commandes-service
```

Accessible via :
- `http://produits.local/products`
- `http://produits.local/orders`

---

## Sécurité : Variables sensibles avec Kubernetes Secret

Un secret `postgres-secret` est créé avec :
```bash
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_PASSWORD=motdepasse
```

Les fichiers `api-deployment.yaml` utilisent :
```yaml
valueFrom:
  secretKeyRef:
    name: postgres-secret
    key: POSTGRES_PASSWORD
```

# Microservice Gestion des Produits

Ici on parle du service `gestion-produits`

---

## Fonctionnalités implémentées

- API REST CRUD pour gérer des produits
- Connexion à une base de données PostgreSQL
- Conteneurisation via Docker
- Déploiement Kubernetes (Deployment + Service)
- Exposition via Ingress (produits.local)
- Publication de l’image sur Docker Hub

---

## Structure du projet

```
gestion-produits/
├── src/
│   ├── config/database.js        # Connexion Sequelize à PostgreSQL
│   ├── controllers/              # Logique métier CRUD
│   ├── models/product.js         # Modèle Sequelize du produit
│   └── routes/productRoutes.js   # Routes REST de l'API
├── app.js                        # Point d'entrée Express
├── Dockerfile                    # Image Docker du service
├── docker-compose.yml            # Orchestration locale avec PostgreSQL
├── api-deployment.yaml           # Déploiement Kubernetes de l’API
├── api-service.yaml              # Service Kubernetes exposant l’API
├── postgres-deployment.yaml      # Déploiement PostgreSQL
├── postgres-service.yaml         # Service PostgreSQL interne
├── api-ingress.yaml              # Ingress NGINX → produits.local
└── .env                          # Variables d’environnement
```

---

## Commandes utilisées

### Lancer en local avec Docker
```bash
docker-compose up --build
```

### Construire et publier sur Docker Hub
```bash
docker login -u VOTRE_USERNAME
docker build -t gestion-produits .
docker tag gestion-produits VOTRE_USERNAME/gestion-produits:latest
docker push VOTRE_USERNAME/gestion-produits:latest
```

### Démarrer Minikube + activer ingress
```bash
minikube start
minikube addons enable ingress
minikube tunnel
```

### Déployer dans Kubernetes
```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
kubectl apply -f api-ingress.yaml
```

### Tester l’API
```bash
curl -H "Host: produits.local" http://produits.local/products
```

---

## Accès via Ingress
Ajoutez dans `/etc/hosts` :
```
127.0.0.1   produits.local
```
Ou utilisez l'IP de Minikube :
```
minikube ip
```

---

## Sécurisation du cluster (RBAC)

Afin de restreindre les accès aux ressources du cluster Kubernetes, un système de contrôle d’accès basé sur les rôles (RBAC) a été mis en place.

### Mise en œuvre :
- Création d’un **ServiceAccount** `readonly-sa`
- Définition d’un **Role** `readonly-role` autorisant uniquement `get`, `list`, `watch` sur les `pods` et `services`
- Association via un **RoleBinding**

### Fichiers YAML :
- `rbac/rbac-service-account.yaml`
- `rbac/rbac-role.yaml`
- `rbac/rbac-rolebinding.yaml`

### Tests effectués :

| Commande                                                                 | Résultat attendu       | Statut |
|--------------------------------------------------------------------------|-------------------------|--------|
| `kubectl get pods --as=system:serviceaccount:default:readonly-sa`       | ✅ Liste visible        | ✅ OK  |
| `kubectl create deployment ... --as=...`                                 | ❌ Accès refusé         | ✅ OK  |

### Résultat :
Le ServiceAccount `readonly-sa` fonctionne avec un rôle restreint, appliquant correctement le principe du **moindre privilège**.

---

## Comment exécuter le projet (localement avec Minikube)

### 1. Lancer Minikube
```bash
minikube start
```

### 2. Activer l'ingress
```bash
minikube addons enable ingress
```

### 3. Activer Docker local dans Minikube
```bash
eval $(minikube docker-env)
```

### 4. Builder les images Docker dans Minikube
```bash
docker build -t gestion-produits-image:latest ./gestion-produits
docker build -t gestion-commandes-image:latest ./gestion-commandes
```

### 5. Appliquer les secrets et déploiements
```bash
kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_PASSWORD=ton_mot_de_passe

kubectl apply -f k8s/
```

### 6. Lancer le tunnel Ingress (dans un terminal séparé)
```bash
minikube tunnel
```

### 7. Ajouter dans `/etc/hosts`
```
127.0.0.1 produits.local
```

---

## Comment tester que tout fonctionne

### Vérifier que les services répondent :
```bash
curl http://localhost:3000/products
curl http://localhost:3001/orders

curl -H "Host: produits.local" http://produits.local/products
curl -H "Host: produits.local" http://produits.local/orders
```

---

## Tester les fonctionnalités principales

### ➕ Ajouter un produit
```bash
curl -X POST http://produits.local/products \
  -H "Host: produits.local" \
  -H "Content-Type: application/json" \
  -d '{"name": "Casque gamer", "price": 89.99, "stock": 10}'
```

### ➖ Supprimer un produit
```bash
curl -X DELETE http://produits.local/products/1 \
  -H "Host: produits.local"
```

### ➕ Ajouter une commande
```bash
curl -X POST http://produits.local/orders \
  -H "Host: produits.local" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2, "status": "pending"}'
```

### Modifier un produit
```bash
curl -X PUT http://produits.local/products/1 \
  -H "Host: produits.local" \
  -H "Content-Type: application/json" \
  -d '{"name": "Casque gamer PRO", "price": 99.99, "stock": 5}'
```

---

# Microservice Gestion des Commandes

Ici la partie du service gestion-commandes

---

## Fonctionnalités principales

- API REST CRUD pour les commandes
- Appel à l’API `produits` pour :
  - Vérifier que le produit existe
  - Vérifier le stock disponible
  - Décrémenter automatiquement le stock si la commande est validée
- Conteneurisation via Docker
- Déploiement Kubernetes (Deployment + Service)

---

## Lancer les tests de base

### ➕ Créer une commande
```bash
curl -X POST http://produits.local/orders \
  -H "Host: produits.local" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2, "status": "pending"}'
```

### Modifier une commande
```bash
curl -X PUT http://produits.local/orders/1 \
  -H "Host: produits.local" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 1, "status": "confirmed"}'
```

### Supprimer une commande
```bash
curl -X DELETE http://produits.local/orders/1 \
  -H "Host: produits.local"
```

---

## Structure du projet

```
gestion-commandes/
├── src/
│   ├── config/database.js
│   ├── controllers/orderController.js
│   ├── models/order.js
│   └── routes/orderRoutes.js
├── app.js
├── Dockerfile
├── docker-compose.yml
```
