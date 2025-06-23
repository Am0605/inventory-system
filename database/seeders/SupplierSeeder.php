<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Tech Solutions Inc.',
                'email' => 'contact@techsolutions.com',
                'phone' => '+1-555-0101',
                'address' => '123 Tech Street, Silicon Valley, CA 94000',
                'contact_person' => 'John Smith',
            ],
            [
                'name' => 'Fashion Forward Ltd.',
                'email' => 'orders@fashionforward.com',
                'phone' => '+1-555-0102',
                'address' => '456 Fashion Ave, New York, NY 10001',
                'contact_person' => 'Sarah Johnson',
            ],
            [
                'name' => 'Book World Publishers',
                'email' => 'sales@bookworld.com',
                'phone' => '+1-555-0103',
                'address' => '789 Library Lane, Boston, MA 02101',
                'contact_person' => 'Michael Brown',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}