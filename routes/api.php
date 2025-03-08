<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group(
  ['prefix' => 'auth'],
  function ($router) {
    Route::post('login',  [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
  }
);

Route::post('refresh', [AuthController::class, 'refresh']);

Route::get('get-all-post', [PostController::class, 'getAllPost']);
//protected routes
Route::middleware(['auth:api'])->group(function () {
  Route::post('me', [AuthController::class, 'me']);
  Route::post('logout', [AuthController::class, 'logout']);
  Route::put('update-profile/{id}', [AuthController::class, 'update']);

  Route::post('create-post', [PostController::class, 'createPost']);
  Route::get('no_of_my_post', [PostController::class, 'getNoOfMyPosts']);
});
