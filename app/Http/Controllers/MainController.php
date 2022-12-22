<?php

namespace App\Http\Controllers;

use App\Helpers\Encryption;

class MainController
{
    public function index()
    {
        return view('users.index');
    }
}
