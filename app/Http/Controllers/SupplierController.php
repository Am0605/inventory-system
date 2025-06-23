<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(): Response
    {
        $suppliers = Supplier::paginate(10);

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
        ]);
    }
}