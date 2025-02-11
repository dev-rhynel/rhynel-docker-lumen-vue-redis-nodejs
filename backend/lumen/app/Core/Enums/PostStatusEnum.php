<?php

namespace App\Core\Enums;

class TaskStatusEnum
{
    const Pending = 'pending';
    const InProgress = 'in_progress';
    const Completed = 'completed';

    /**
     * Get all status values.
     *
     * @return array
     */
    public static function getValues(): array
    {
        return [
            self::Pending,
            self::InProgress,
            self::Completed,
        ];
    }
}
