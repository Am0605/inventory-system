<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'type',
        'customer_id',
        'supplier_id',
        'status',
        'subtotal',
        'tax_amount',
        'total',
        'order_date',
        'delivery_date',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2', 
        'total' => 'decimal:2',
        'order_date' => 'date',
        'delivery_date' => 'date',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items(): HasMany // Fixed relationship name
    {
        return $this->hasMany(OrderItem::class);
    }

    // Keep the old name for backward compatibility
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
