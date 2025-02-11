<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Core\Resources\AppJsonResource;

class UserResource extends AppJsonResource
{
    /**
    * Transform the resource into an array.
    *
    * @return array<string, mixed>
    */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->when($this->last_name, $this->last_name),
            'email' => $this->email,
        ];
    }
}