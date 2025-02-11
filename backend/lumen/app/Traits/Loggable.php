<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait Loggable
{
    protected function logInfo($message, array $context = [])
    {
        Log::info($message, $context);
    }

    protected function logError($message, array $context = [])
    {
        Log::error($message, $context);
    }

    protected function logWarning($message, array $context = [])
    {
        Log::warning($message, $context);
    }

    protected function logDebug($message, array $context = [])
    {
        Log::debug($message, $context);
    }
}
