# Documentation de l'implémentation Backend (Laravel)

Cette documentation décrit les modifications apportées à l'API Laravel pour supporter les nouvelles fonctionnalités de gestion des produits et des vendeurs.

## 1. Base de données (Migrations)
- **Produits** : Ajout des colonnes `weight` (decimal) et `carat` (decimal) à la table `products` pour stocker les caractéristiques techniques des bijoux.
- **Vendeurs** : La table `vendors` a été confirmée avec les champs `name`, `email`, `phone`, `company`, `siret` et `active`.

## 2. Modèles (Models)
- **Product** : Ajout de `weight` et `carat` dans la propriété `$fillable`.
- **User** : Gestion du champ `vendor_id` pour lier un utilisateur à sa boutique.
- **Vendor** : Modèle complet avec relation `hasMany` vers les produits.

## 3. Contrôleurs (Controllers)
- **AuthController** :
    - `login` : Validation du rôle lors de la connexion.
    - `register` : Nouvelle méthode permettant l'inscription simultanée d'un utilisateur et de sa boutique (Vendor).
- **ProductController** :
    - Mise à jour de `store` et `update` pour valider et enregistrer le poids et le carat.
    - Sécurisation des méthodes `update` et `destroy` pour que seul le propriétaire (vendeur) puisse modifier ses produits.
- **VendorController** :
    - Implémentation du CRUD complet pour la gestion des vendeurs (index, store, show, update, destroy).

## 4. Routes (api.php)
- Ajout de `Route::post('/register', ...)` pour l'inscription.
- Ajout des routes `/admin/vendors` protégées par Sanctum pour la gestion des comptes vendeurs.
