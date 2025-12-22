<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'type',
        'image',
        'rating',
        'available',
        'vendor_id',
        'weight',
        'carat',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}
