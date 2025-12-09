# Project Documentation

This document provides an overview of the project, how to set it up, and details about its features.

## Project Setup

This is a React Native project with a PHP backend.

### Backend API

The backend is a PHP project located in the `devMobile/jewelry-api` directory.

To run the backend:
1.  Navigate to the `devMobile/jewelry-api` directory.
2.  Install PHP dependencies using Composer:
    ```bash
    composer install
    ```
3.  Start a local PHP server in that directory. For instance, using PHP's built-in server:
    ```bash
    php -S localhost:8000
    ```

### Mobile Application

The mobile application is a React Native project located in the `devMobile/jewelry_rn_app_starter` directory.

To run the mobile app:
1.  Navigate to the `devMobile/jewelry_rn_app_starter` directory.
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
    or if you use Yarn:
    ```bash
    yarn install
    ```
3.  Start the Metro bundler:
    ```bash
    npm start
    ```
    or
    ```bash
    yarn start
    ```
4.  Follow the instructions in the terminal to run the app on an Android/iOS emulator or a physical device.

## Features

### Authentication

*   **`AuthScreen.tsx`**: Handles user authentication, including login and registration.

### Home Screen

*   **`HomeScreen.tsx`**: The main screen that users see after logging in. It likely provides navigation to other features of the application.

### Product Management (CRUD)

The application allows users to manage their products. The following CRUD (Create, Read, Update, Delete) operations for products have been implemented:

*   **Create**: Users can add new products through the "Ajouter" button on the `ProductManagementScreen`, which navigates to the `AddProductScreen`.
*   **Read**:
    *   The `ProductManagementScreen` displays a list of products belonging to the user.
    *   It fetches the products using `fetchMyProducts` service.
    *   Users can search for products by name.
    *   Users can view product details by tapping on a product, which navigates to the `ProductDetailScreen`.
*   **Update**: Users can edit an existing product from the `ProductManagementScreen` by tapping the "Modifier" button, which navigates to the `EditProductScreen`.
*   **Delete**: Users can delete a product from the `ProductManagementScreen` using the "Supprimer" button. A confirmation dialog is shown before deleting the product.

### Gold Price

*   **`GoldPriceScreen.tsx`**: This screen displays current gold prices. The data is likely fetched from an external API.

### Ring Size Calculator

*   **`SizeCalculatorScreen.tsx`**: A utility for users to calculate their ring size.

### Admin Features

*   **`AdminDashboardScreen.tsx`**: A central dashboard for administrators, providing access to various administrative functions.
*   **`VendorManagementScreen.tsx`**: Allows administrators to manage vendor accounts.

### Vendor Features

*   **`VendorDashboardScreen.tsx`**: A dashboard for vendors to manage their products and view other relevant information.
