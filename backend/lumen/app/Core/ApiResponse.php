<?php

namespace App\Classes;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class ApiResponse
{
    public static function rollback($e, $message = "Something went wrong! Process not completed")
    {
        DB::rollBack();
        self::throw($e, $message);
    }

    public static function throw($e, $message = "Something went wrong! Process not completed")
    {
        Log::info($e);
        throw new HttpResponseException(response()->json(["message" => $message], 500));
    }

    public static function success($result, $message = null, $code = 200)
    {
        $response = [
            'success' => true,
            'data'    => $result
        ];
        if(!empty($message)) {
            $response['message'] = $message;
        }
        return response()->json($response, $code);
    }

    public static function error($message, $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $message
        ];
        return response()->json($response, $code);
    }
}