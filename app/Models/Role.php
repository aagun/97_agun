<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Casts\UpperCase;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'roles';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = ['name', 'description'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'name' => UpperCase::class
        ];
    }

}
