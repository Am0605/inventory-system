<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function index(): Response
    {
        $warehouses = Warehouse::paginate(10);

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
        ]);
    }
}