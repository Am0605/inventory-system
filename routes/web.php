<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Inventory Routes
    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('products', function () {
            return Inertia::render('inventory/products/index');
        })->name('products.index');
        
        Route::get('products/create', function () {
            return Inertia::render('inventory/products/create');
        })->name('products.create');
        
        Route::get('categories', function () {
            return Inertia::render('inventory/categories/index');
        })->name('categories.index');
        
        Route::get('low-stock', function () {
            return Inertia::render('inventory/low-stock');
        })->name('low-stock');
    });

    // Orders Routes
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('orders/index');
        })->name('index');
        
        Route::get('create', function () {
            return Inertia::render('orders/create');
        })->name('create');
        
        Route::get('purchase', function () {
            return Inertia::render('orders/purchase');
        })->name('purchase');
    });

    // Suppliers Routes
    Route::get('suppliers', function () {
        return Inertia::render('suppliers/index');
    })->name('suppliers.index');

    // Customers Routes
    Route::get('customers', function () {
        return Inertia::render('customers/index');
    })->name('customers.index');

    // Warehouses Routes
    Route::get('warehouses', function () {
        return Inertia::render('warehouses/index');
    })->name('warehouses.index');

    // Reports Routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('sales', function () {
            return Inertia::render('reports/sales');
        })->name('sales');
        
        Route::get('inventory', function () {
            return Inertia::render('reports/inventory');
        })->name('inventory');
        
        Route::get('financial', function () {
            return Inertia::render('reports/financial');
        })->name('financial');
        
        Route::get('stock-movement', function () {
            return Inertia::render('reports/stock-movement');
        })->name('stock-movement');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
