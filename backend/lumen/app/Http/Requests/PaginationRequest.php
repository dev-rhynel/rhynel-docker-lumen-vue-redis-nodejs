<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;

class PaginationRequest extends Request
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'sort_by' => 'sometimes|string|in:created_at,title,content',
            'sort_direction' => 'sometimes|string|in:asc,desc',
            'itemsPerPage' => 'sometimes|integer|min:1|max:100',
            'search' => 'sometimes|string|max:255',
            'filters' => 'sometimes|array',
        ];
    }

    /**
     * Get the default values for the request.
     *
     * @return array
     */
    public function defaults()
    {
        return [
            'sort_by' => 'created_at',
            'sort_direction' => 'desc',
            'itemsPerPage' => 10,
        ];
    }

    /**
     * Get all input with defaults applied.
     *
     * @return array
     */
    public function all($keys = null)
    {
        $input = parent::all($keys);
        return array_merge($this->defaults(), $input);
    }
}
