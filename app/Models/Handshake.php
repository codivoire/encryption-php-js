<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Handshake extends Model
{
    public $timestamps = false;
    public $incrementing = false;

    protected $table = 'handshakes';
    protected $primaryKey = 'uuid';
    protected $keyType = 'string';
    protected $guarded = [];

    protected $fillable = [
        'uuid',
        'public_key',
        'shared_key',
        'expires_at',
    ];

    protected $casts = [
        'uuid' => 'string',
        'public_key' => 'string',
        'shared_key' => 'string',
        'expires_at' => 'datetime',
    ];

    public function scopeNotExpires(Builder $query, string $uuid): Builder
    {
        return $query->whereUuid($uuid)->where('expires_at', '>', Carbon::now());
    }
}
