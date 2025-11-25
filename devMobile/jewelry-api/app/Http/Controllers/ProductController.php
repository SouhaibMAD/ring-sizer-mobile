<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Liste des produits (pour le HomeScreen).
     */
    public function index()
    {
        // Get products from database with vendor information
        $products = Product::with('vendor')->get();
        
        return response()->json($products);
    }

    /**
     * Détail d’un produit (pour ProductDetail).
     */
    public function show(string $id)
    {
        // Version DB (quand Product existe vraiment en base)
        return Product::with('vendor')->findOrFail($id);
    }

    public function store(Request $request)
    {
        // À faire plus tard (création produit)
    }

    public function update(Request $request, string $id)
    {
        // À faire plus tard
    }

    public function destroy(string $id)
    {
        // À faire plus tard
    }
}
