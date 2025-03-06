<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRegisterRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      "email" => "required|string|unique:users|max:255",
      'name' => "required|string|max:255|min:3",
      "password" => "required|string|min:6|max:50",
      'varsity' => "nullable|string|max:255",
      'department' => "nullable|string|max:255",
      'confirm_password' => "same:password"
    ];
  }
}
