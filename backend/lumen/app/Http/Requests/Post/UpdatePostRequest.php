<?php

namespace App\Http\Requests\Post;

use App\Core\Enums\PostStatusEnum;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Http\Request;

class UpdatePostRequest extends Request
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string'],
            'content' => ['required', 'string'],
            'status' => ['sometimes', 'required', new Enum(PostStatusEnum::class)],
        ];
    }

    /**
     * Get the validated data from the request.
     *
     * @return array
     */
    public function validated()
    {
        $validator = app('validator')->make($this->all(), $this->rules());
        
        if ($validator->fails()) {
            abort(422, 'The given data was invalid.');
        }
        
        return $validator->validated();
    }
}