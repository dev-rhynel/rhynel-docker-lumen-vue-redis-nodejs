<?php

namespace App\Http\Requests\Auth;

use Laravel\Lumen\Http\Request;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends Request
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',      // at least one lowercase letter
                'regex:/[A-Z]/',      // at least one uppercase letter
                'regex:/[0-9]/',      // at least one number
                'regex:/[@$!%*#?&]/', // at least one special character
            ],
        ];
    }

    /**
     * Force to lowercase
     */
    protected function prepareForValidation()
    {
        $data = json_decode($this->getContent(), true) ?? [];
        $this->merge($data);
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower($this->input('email'))
            ]);
        }
    }   
}