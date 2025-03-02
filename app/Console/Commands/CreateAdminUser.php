<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'user:create-admin
    {name : The name of admin user}
                            {email : The email of the admin user}
                            {password : The password for the admin user}
                            {--role=admin : The role of the admin user}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Create an admin user with provided details';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $name = $this->argument('name');
    $email = $this->argument('email');
    $password = $this->argument('password');
    $role = 'admin';

    $user = new User();
    $user->fill([
      'name' => $name,
      'email' => $email,
      'password' => Hash::make($password),
    ]);
    $user->role = $role; // Set the role directly
    $user->save();

    $this->info('Admin user created successfully.');
    $this->info('Name: ' . $name);
    $this->info('Email: ' . $email);
    $this->info('Role: ' . $role);
  }
}
