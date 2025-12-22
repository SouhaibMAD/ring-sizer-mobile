<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Vendor::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:vendors,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'company' => 'nullable|string',
            'siret' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $vendor = Vendor::create($validated);

        return response()->json($vendor, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Vendor::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $vendor = Vendor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:vendors,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'company' => 'nullable|string',
            'siret' => 'nullable|string',
            'active' => 'sometimes|boolean',
        ]);

        $vendor->update($validated);

        return response()->json($vendor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->delete();

        return response()->json(null, 204);
    }

    public function products($id)
    {
        $vendor = Vendor::findOrFail($id);

        return response()->json($vendor->products);
    }
}
