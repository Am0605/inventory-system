<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Alice Johnson',
                'email' => 'alice@example.com',
                'phone' => '+1-555-1001',
                'address' => '123 Main St, Anytown, USA 12345',
                'company' => 'Johnson Enterprises',
            ],
            [
                'name' => 'Bob Wilson',
                'email' => 'bob@example.com',
                'phone' => '+1-555-1002',
                'address' => '456 Oak Ave, Somewhere, USA 67890',
                'company' => null,
            ],
            [
                'name' => 'Carol Davis',
                'email' => 'carol@example.com',
                'phone' => '+1-555-1003',
                'address' => '789 Pine Rd, Elsewhere, USA 54321',
                'company' => 'Davis & Co.',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}