<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
  public function register(UserRegisterRequest $request)
  {
    $validatedData = $request->validated();
    // $user = User::create([
    //   "email" => $validatedData["email"],
    //   "name" => $validatedData["name"],
    //   "password" => bcrypt($validatedData["password"]),
    //   "varsity" => $validatedData["varsity"] ?? null,
    //   "department" => $validatedData["department"] ?? null
    // ]);


    $userId = DB::table('users')->insertGetId([
      "email" => $validatedData["email"],
      "name" => $validatedData["name"],
      "password" => bcrypt($validatedData["password"]),
      "varsity" => $validatedData["varsity"] ?? null,
      "department" => $validatedData["department"] ?? null,
      "created_at" => now(),
      "updated_at" => now()
    ]);
    $user = User::find($userId);
    $token = auth('api')->login($user);

    return $this->respondWithToken($token, $user);
  }
  public function login()
  {
    $credentials = request(['email', 'password']);

    if (! $token = auth('api')->attempt($credentials)) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }
    return $this->respondWithToken($token, auth('api')->user());
  }

  /**
   * Get the authenticated User.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function me()
  {
    return response()->json(auth()->user());
  }

  /**
   * Log the user out (Invalidate the token).
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function logout()
  {
    auth()->logout();

    return response()->json(['message' => 'Successfully logged out']);
  }

  /**
   * Refresh a token.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function refresh()
  {
    return $this->respondWithToken(auth('api')->refresh());
  }

  /**
   * Get the token array structure.
   *
   * @param  string $token
   *
   * @return \Illuminate\Http\JsonResponse
   */
  protected function respondWithToken($token, $user = null)
  {
    return response()->json([
      'access_token' => $token,
      'token_type' => 'bearer',
      'expires_in' => auth('api')->factory()->getTTL() * 60,
      'user' => $user
    ]);
  }

  //user defined
  public function update(UpdateUserRequest $request, $id)
  {
    $user = DB::table('users')->where('id', $id)->first();

    if (!$user) {
      return response()->json(['error' => 'User not found'], 404);
    }

    // Check current password if a new password is provided
    if ($request->filled('password')) {
      if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['error' => 'Current password is incorrect'], 403);
      }

      // Hash the new password
      $newPassword = bcrypt($request->password);
      DB::table('users')->where('id', $id)->update(['password' => $newPassword]);
    }

    $validatedData = $request->validated();
    DB::table('users')->where('id', $id)->update($validatedData);

    $updatedUser = DB::table('users')->where('id', $id)->first();
    return response()->json($updatedUser, status: 201);
  }

  public function redirectToProvider()
  {
    return Socialite::driver('google')->stateless()->redirect();
  }

  public function handleProviderCallback()
  {
    $googleUser = Socialite::driver('google')->stateless()->user();

    $user = User::updateOrCreate(
      ['email' => $googleUser->getEmail()],
      [
        'name' => $googleUser->getName(),
        'google_id' => $googleUser->getId(),
        'password' => bcrypt(str()->random(16)),
      ]
    );
    $token = auth('api')->login($user);

    return redirect()->to("http://localhost:5173/auth/google-callback?token=$token&user=" . urlencode(json_encode([
      'id' => $user->id,
      'name' => $user->name,
      'email' => $user->email,
      'varsity' => $user->varsity,
      'department' => $user->department,
      'points' => $user->points
    ])));
    // return $this->respondWithToken($token, auth('api')->user());
  }
}
