<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'company',
        'siret',
        'active',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}