<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            [
                'name' => 'Main Warehouse',
                'code' => 'WH001',
                'address' => '100 Industrial Blvd, Warehouse District, NY 10001',
                'manager_name' => 'James Miller',
                'phone' => '+1-555-2001',
            ],
            [
                'name' => 'Secondary Storage',
                'code' => 'WH002',
                'address' => '200 Storage Lane, Distribution City, CA 90210',
                'manager_name' => 'Emma Wilson',
                'phone' => '+1-555-2002',
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}