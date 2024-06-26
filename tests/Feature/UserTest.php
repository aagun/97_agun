<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;
use App\Services\UserService;

class UserTest extends TestCase
{
    private UserService $userService;

    protected function setUp(): void
    {
        parent::setUp();

        DB::delete('delete from users');
        DB::delete('delete from roles');

        $this->userService = $this->app->make(UserService::class);
    }

    public function testInsert()
    {
        $this->seed(RoleSeeder::class);

        $payload = [
            'full_name' => fake()->name(),
            'nickname' => explode(' ', fake()->name())[1],
            'phone_number' => generatePhoneNumber(),
            'address' => fake()->address(),
            'birth_date' => fake()->date(),
            'gender' => 'l',
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ];

        $new_user = new User($payload);
        $new_user->role_id = 1;
        $new_user->save();

        self::assertNotNull($new_user->id);
    }

    public function testInsertMany()

    {
        // Arrange
        $this->seed(RoleSeeder::class);

        $users = [
            [
                'id' => Str::uuid()->toString(),
                'full_name' => fake()->name(),
                'nickname' => explode(' ', fake()->name())[1],
                'phone_number' => generatePhoneNumber(),
                'address' => fake()->address(),
                'birth_date' => fake()->date(),
                'gender' => 'l',
                'email' => fake()->unique()->safeEmail(),
                'email_verified_at' => now(),
                'role_id' => 1,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ],
            [
                'id' => Str::uuid()->toString(),
                'full_name' => fake()->name(),
                'nickname' => explode(' ', fake()->name())[1],
                'phone_number' => generatePhoneNumber(),
                'address' => fake()->address(),
                'birth_date' => fake()->date(),
                'gender' => 'p',
                'role_id' => 1,
                'email' => fake()->unique()->safeEmail(),
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
            ]
        ];

        // Action
        $result = User::query()->insert($users);

        // Assert
        self::assertTrue($result);
        self::assertEquals(2, User::all()->count());

    }

    public function testSoftDelete()
    {
        // Arrange
        $this->seed([RoleSeeder::class, UserSeeder::class]);

        // Action
        $user = User::all()->first();
        $user->delete();

        // Assert
        self::assertTrue($user->trashed());
        self::assertCount(24, User::all());
        self::assertCount(1, User::onlyTrashed()->get());
    }

    public function testBelongsTo()
    {
        // Arrange
        $this->seed([RoleSeeder::class, UserSeeder::class]);

        // Action
        $user = User::all()->first();

        // Assert
        self::assertNotNull($user);
        self::assertNotNull($user->role);
    }

    public function testCountByRoleName()
    {
        $this->seed([RoleSeeder::class, UserSeeder::class]);
        $total_ordinary_users = $this->userService->countByRoleName('RO_USER');
        self::assertEquals(24, $total_ordinary_users);
    }

}
