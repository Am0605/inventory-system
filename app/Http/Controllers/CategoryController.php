<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->paginate(10);

        return Inertia::render('inventory/categories/index', [
            'categories' => $categories,
        ]);
    }
}