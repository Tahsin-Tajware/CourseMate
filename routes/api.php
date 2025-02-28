<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SavedPostController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\VoteController;
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

//admin routes
Route::group(
  ['prefix' => 'admin'],
  function () {
    Route::post('auth/login', [AuthController::class, 'adminLogin']);
  }
);

//no access token needed
Route::post('refresh', [AuthController::class, 'refresh']);
Route::get('get-all-post', [PostController::class, 'getAllPost']);
Route::get('comment/{post_id}', [CommentController::class, 'getAllComments']);
Route::get('post_by_id/{post_id}', [PostController::class, 'getPostById']);
Route::get('post_by_tag/{tag_id}', [PostController::class, 'getPostsByTag']);
Route::get('search', [SearchController::class, 'search']);
//protected routes

Broadcast::routes(['middleware' => ['auth:api']]);
Route::middleware(['auth:api'])->group(function () {
  //user-info
  Route::post('me', [AuthController::class, 'me']);
  Route::post('logout', [AuthController::class, 'logout']);
  Route::put('update-profile/{id}', [AuthController::class, 'update']);

  //post-related
  Route::post('create-post', [PostController::class, 'createPost']);
  Route::get('no_of_my_post', [PostController::class, 'getNoOfMyPosts']);
  Route::get('my_post', [PostController::class, 'getMyPost']);
  Route::put('update_post/{post_id}', [PostController::class, 'updatePost']);
  Route::delete('delete_post/{post_id}', [PostController::class, 'deletePost']);

  //saved post-related
  Route::post('save-post/{post_id}', [SavedPostController::class, 'save_post']);
  Route::delete('unsave-post/{post_id}', [SavedPostController::class, 'delete_saved_post']);
  Route::get('saved-post', [SavedPostController::class, 'get_saved_posts']);

  //comment-related
  Route::post('vote', [VoteController::class, 'store']);
  Route::delete('vote/{voteId}', [VoteController::class, 'destroy']);

  Route::post('comment/{post_id}', [CommentController::class, 'storeComment']);
  Route::delete('comment/{comment_id}', [CommentController::class, 'deleteComment']);
  Route::put('update-comment/{comment_id}', [CommentController::class, 'updateComment']);

  //notification-related
  Route::get('notification', [NotificationController::class, 'getAllNotifications']);
  Route::get('notification/unread', [NotificationController::class, 'getUnreadNotifications']);
  Route::post('notification/mark-as-read/{id}', [NotificationController::class, 'markNotificationAsRead']);
  Route::post('notification/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
  Route::get('notification/count', [NotificationController::class, 'countUnread']);
  Route::delete('notification/{id}', [NotificationController::class, 'deleteNotification']);
});
