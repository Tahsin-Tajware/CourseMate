<?php

// use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('notifications.{userId}', function ($user, $userId) {
//   return (int) $user->id === (int) $userId;
// }); , ['middleware' => ['auth:api']]


use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

Broadcast::channel('App.Models.User.{userId}', function ($user, $userId) {
  \Log::info('Broadcast Auth Attempt:', ['user' => $user, 'userId' => $userId]);

  if (!$user) {
    \Log::error('Broadcast Auth Failed: No user found.');
    return false;
  }

  return (int) $user->id === (int) $userId;
}, ['guards' => ['api']]);
