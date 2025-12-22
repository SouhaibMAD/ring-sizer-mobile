<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'weight')) {
                $table->decimal('weight', 8, 2)->nullable()->after('description');
            }
            if (!Schema::hasColumn('products', 'carat')) {
                $table->decimal('carat', 4, 2)->nullable()->after('weight');
            }
            // Supprimer carad si jamais il a été créé par erreur
            if (Schema::hasColumn('products', 'carad')) {
                $table->dropColumn('carad');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['weight', 'carat']);
        });
    }
};
