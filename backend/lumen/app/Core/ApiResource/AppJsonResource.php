<?php

namespace App\Core\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Core\Resources\AppAnonymousResourceCollection;

class AppJsonResource extends JsonResource
{
    public static function collection($resource)
    {
        return tap(new AppAnonymousResourceCollection($resource, static::class), function ($collection) {
            if (property_exists(static::class, 'preserveKeys')) {
                $collection->preserveKeys = (new static([]))->preserveKeys === true;
            }
        });
    }
}