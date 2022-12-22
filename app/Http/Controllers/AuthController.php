<?php

namespace App\Http\Controllers;

use App\Helpers\Encryption;
use App\Helpers\ResponseSchema;
use App\Models\Handshake;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function handshake(Request $request)
    {
        $uuid = $request->get('uuid');
        $handshake = Handshake::notExpires($uuid)->first();

        if (!$handshake) {
            $handshake = Handshake::create([
                'uuid' => $uuid,
                'public_key' => (string) $request->get('public_key'),
                'shared_key' => Str::random(32),
                'expires_at' => Carbon::now()->addMonths(3),
            ]);
        }

        $payload = Encryption::encryptSharedKey($handshake->shared_key, $handshake->public_key);

        return response()->json(['payload' => $payload]);
    }

    public function login()
    {
        return response()->json(['success' => true]);
    }

    public function register()
    {
        return response()->json(['success' => true]);
    }

    public function logout()
    {
        return response()->json(['success' => true]);
    }
}
