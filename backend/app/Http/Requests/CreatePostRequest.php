<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePostRequest extends FormRequest
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
      'title' => 'required|string',
      'content' => 'required|string',
      'is_anonymous' => 'nullable|boolean',
      //'user_id' => 'required|exists:users,id',
      'tags' => 'required|array',
      'tags.*.course_name' => 'required|string|max:255',
      'tags.*.course_code' => 'required|string|max:50',
      'tags.*.varsity' => 'required|string|max:255',

    ];
  }
}
