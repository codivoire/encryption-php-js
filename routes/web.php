<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [MainController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/handshake', [AuthController::class, 'handshake']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});


Route::middleware(['encrypt', 'decrypt'])->group(function () {
    Route::match(['GET', 'POST'], '/users', [UsersController::class, 'index']);
    Route::get('/users/{id}', [UsersController::class, 'show']);
    Route::post('/users/store', [UsersController::class, 'store']);
    Route::put('/users/{id}', [UsersController::class, 'update']);
    Route::delete('/users/{id}', [UsersController::class, 'delete']);
});
