<?php

namespace App\Core;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;

class ApiResponse
{
    public static function rollback($e, $message = "Something went wrong! Process not completed")
    {
        DB::rollBack();
        throw new HttpResponseException(response()->json(["message" => $message], 500));
    }

    public static function throw($e, $message = "Something went wrong! Process not completed")
    {
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

    public static function error($message, $code = 404, $errors = [])
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }


        return response()->json($response, $code);
    }
}