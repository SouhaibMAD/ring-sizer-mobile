# Documentation de l'implémentation Frontend (React Native)

Cette documentation décrit les changements apportés à l'application mobile pour intégrer les fonctionnalités vendeurs et les détails techniques des produits.

## 1. Gestion de l'Authentification
- **Suppression du rôle Client** : L'interface ne propose plus que les rôles "Vendeur" et "Admin".
- **Inscription Vendeur** : Ajout d'un formulaire complet incluant le nom de l'entreprise, le numéro de téléphone et le SIRET.
- **Navigation Post-Login** : Redirection automatique vers le `VendorDashboard` ou l' `AdminDashboard` selon le rôle.
- **Style** : Le bouton de déconnexion a été coloré en rouge pour une meilleure ergonomie.

## 2. Gestion des Produits
- **Champs techniques** : Intégration du **Poids (g)** et du **Carat (ct)** dans les écrans d'ajout (`AddProductScreen`) et de modification (`EditProductScreen`).
- **Affichage des détails** : `ProductDetailScreen` affiche désormais ces caractéristiques sous forme d'icônes descriptives.
- **Suppression** : Correction de la logique de suppression dans `ProductManagementScreen`.

## 3. Communication API
- **Configuration Réseau** : Centralisation de l'IP locale dans `src/config/apiConfig.ts` pour faciliter les tests sur appareils physiques.
- **Services (Services/products.ts)** : Mise à jour des interfaces `Product` et `ApiProduct` pour inclure les nouveaux champs.
- **Actions directes** : Le bouton "Contacter le vendeur" déclenche désormais un appel téléphonique direct via le module `Linking`.

## 4. Expérience Utilisateur
- Utilisation de `Lucide-react-native` pour les icônes de poids (`Scale`) et de carat (`Gem`).
- Amélioration de la gestion des erreurs lors des requêtes réseau.
