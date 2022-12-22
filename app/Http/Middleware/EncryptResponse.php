<?php

namespace App\Http\Middleware;

use App\Helpers\Encryption;
use App\Models\Handshake;
use Illuminate\Http\Request;

class EncryptResponse
{
    public function handle(Request $request, \Closure $next)
    {
        $response = $next($request);
        $uuid = $request->get('uuid');
        $handshake = Handshake::notExpires($uuid)->first();
        $payload = Encryption::encrypt($response->content(), $handshake->shared_key);

        $status = $response->status();
        $headers = $response->headers->all();

        return response()->json(['payload' => $payload], $status, $headers);
    }
}
