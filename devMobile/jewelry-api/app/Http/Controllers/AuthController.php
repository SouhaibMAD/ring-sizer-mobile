<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
            'role'     => 'nullable|in:client,vendor,admin', // Optional role selection
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (! $user || ! Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Bad credentials'], 401);
        }

        // Validate role if provided
        if (isset($fields['role']) && $user->role !== $fields['role']) {
            return response()->json([
                'message' => "You cannot login as {$fields['role']}. Your account role is {$user->role}."
            ], 403);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'user' => [
                'id'       => $user->id,
                'email'    => $user->email,
                'role'     => $user->role,
                'vendorId' => $user->vendor_id,
            ],
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $u = $request->user();

        return response()->json([
            'id'       => $u->id,
            'email'    => $u->email,
            'role'     => $u->role,
            'vendorId' => $u->vendor_id,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
