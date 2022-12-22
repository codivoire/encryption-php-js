<?php

namespace App\Http\Controllers;

use App\Helpers\Encryption;
use App\Helpers\ResponseSchema;
use App\Models\Handshake;
use App\Models\User;
use Illuminate\Http\Request;

class UsersController
{
    public function index(Request $request)
    {
        $response = new ResponseSchema();
        $uuid = $request->get('uuid');
        $handshake = Handshake::notExpires($uuid)->first();

        $users = User::get()->all();
        $response->data = $users;

        $payload = Encryption::encrypt(json_encode($response->toArray()), $handshake->shared_key);

        return response()->json(['payload' => $payload]);
    }

    public function show(int $id)
    {
        $response = new ResponseSchema();
        $response->data = User::where('id', $id)->first();
        return $response;
    }

    public function store(Request $request)
    {
        $user = new User([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'city' => $request->input('city'),
        ]);

        try {
            $user->save();
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'An error has occurred'], 400);
        }

        return response()->json(['success' => false]);
    }

    public function update(Request $request, int $id)
    {
        $user = User::where('id', $id)->first();

        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->city = $request->input('city');
    }

    public function delete(int $id)
    {
        $user = User::where('id', $id)->first();

        try {
            $user->delete();
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'An error has occurred'], 400);
        }

        return response()->json(['success' => true]);
    }
}
