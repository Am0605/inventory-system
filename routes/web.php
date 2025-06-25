<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Inventory Routes
    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        
        Route::get('low-stock', [ProductController::class, 'lowStock'])->name('low-stock');
    });

    // Orders Routes
    Route::prefix('orders')->name('orders.')->group(function () {
        // Main orders routes
        Route::get('/list', [OrderController::class, 'index'])->name('index');
        Route::get('{order}/edit', [OrderController::class, 'edit'])->name('edit');
        Route::put('{order}', [OrderController::class, 'update'])->name('update');
        Route::delete('{order}', [OrderController::class, 'destroy'])->name('destroy');
        
        // Sales Orders
        Route::get('sales', [OrderController::class, 'sales'])->name('sales');
        Route::get('sales/create', [OrderController::class, 'create'])->name('sales.create');
        Route::post('sales', [OrderController::class, 'store'])->name('sales.store');
        
        // Purchase Orders
        Route::get('purchase', [OrderController::class, 'purchase'])->name('purchase');
        Route::get('purchase/create', [OrderController::class, 'createPurchase'])->name('purchase.create');
        Route::post('purchase', [OrderController::class, 'storePurchase'])->name('purchase.store');
    });

    // Customers Routes
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Suppliers Routes
    Route::get('suppliers', [SupplierController::class, 'index'])->name('suppliers.index');

    // Warehouses Routes
    Route::get('warehouses', [WarehouseController::class, 'index'])->name('warehouses.index');

    // Reports Routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('sales', [ReportController::class, 'sales'])->name('sales');
        Route::get('inventory', [ReportController::class, 'inventory'])->name('inventory');
        Route::get('financial', [ReportController::class, 'financial'])->name('financial');
        Route::get('stock-movement', [ReportController::class, 'stockMovement'])->name('stock-movement');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
