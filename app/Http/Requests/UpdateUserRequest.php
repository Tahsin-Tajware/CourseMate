<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
    $userId = $this->route('id');
    $rules = [
      'name' => "required|string|max:255|min:3",
      'varsity' => "nullable|string|max:255",
      'department' => "nullable|string|max:255",
    ];
    if ($this->filled('password')) {
      $rules = array_merge($rules, [
        'current_password' => 'required|string',
        'password' => 'required|string|min:6|max:50',
        'confirm_password' => 'same:password'
      ]);
    }
    return $rules;
  }
}
