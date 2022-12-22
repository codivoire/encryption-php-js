<?php

namespace App\Http\Middleware;

use App\Helpers\Encryption;
use App\Helpers\ResponseSchema;
use App\Models\Handshake;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;

class DecryptRequest
{
    public function handle(Request $request, Closure $next)
    {
        $response = new ResponseSchema();

        if (in_array(strtolower($request->method()), ['get', 'delete', 'options'])) {
            return $next($request);
        }

        if (!$request->exists('uuid') || !$request->get('payload')) {
            return $response->error(414, 'Unexpected request');
        }

        $uuid = (string) $request->get('uuid');
        $handshake = Handshake::whereUuid($uuid)->first();

        if (!$handshake) {
            return $response->error(415, 'Unexpected request');
        }

        if ($handshake->expires_at < Carbon::now()) {
            return $response->error(416, 'Handshake expired');
        }

        $payload = (string) $request->get('payload');
        $values = (array) Encryption::decrypt($payload, $handshake->shared_key);

        $request->request->add($values);
        $request->request->remove('payload');

        return $next($request);
    }
}
