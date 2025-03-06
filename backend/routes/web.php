<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
  return view('welcome');
});
Route::get('api/auth/google', [AuthController::class, 'redirectToProvider']);
Route::get('api/auth/google-callback', [AuthController::class, 'handleProviderCallback']);
