<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
     * Get products for the authenticated vendor.
     */
    public function myProducts()
    {
        $user = Auth::user();

        if (!$user->vendor_id) {
            return response()->json(['message' => 'User is not a vendor'], 403);
        }

        $products = Product::where('vendor_id', $user->vendor_id)->get();

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'type' => 'required|in:bague,bracelet,collier,boucles,montre',
            'image' => 'nullable|url',
        ]);

        $user = Auth::user();

        // Create the product
        $product = Product::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'image' => $validated['image'],
            'available' => $request->input('available', true),
            'vendor_id' => $user->vendor_id,
        ]);

        return response()->json($product, 201);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:bague,bracelet,collier,boucles,montre',
            'image' => 'nullable|url',
            'available' => 'sometimes|boolean',
        ]);

        $product = Product::findOrFail($id);
        $user = Auth::user();

        // Check if the user is the vendor of the product
        if ($product->vendor_id !== $user->vendor_id) {
            return response()->json(['message' => 'You are not authorized to update this product'], 403);
        }

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $user = Auth::user();

        if ($product->vendor_id !== $user->vendor_id) {
            return response()->json(['message' => 'You are not authorized to delete this product'], 403);
        }

        $product->delete();

        return response()->json(null, 204);
    }
}
