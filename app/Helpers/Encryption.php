<?php

namespace App\Helpers;

class Encryption
{
    public const CIPHER_ALGORITHM = 'AES-256-CBC';

    public static function encryptSharedKey(string $data, string $publicKey)
    {
        openssl_public_encrypt($data, $output, $publicKey, OPENSSL_PKCS1_PADDING);
        return base64_encode($output);
    }

    public static function encrypt(string $data, string $sharedKey)
    {
        $ivLength = openssl_cipher_iv_length(self::CIPHER_ALGORITHM);
        $iv = openssl_random_pseudo_bytes($ivLength);
        $output = openssl_encrypt($data, self::CIPHER_ALGORITHM, $sharedKey, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv . $output);
    }

    public static function decrypt(string $data, string $sharedKey)
    {
        $payload = base64_decode($data);
        $iv = mb_substr($payload, 0, 16, '8bit');
        $encrypted = mb_substr($payload, 16, null, '8bit');
        $decrypted = openssl_decrypt($encrypted, self::CIPHER_ALGORITHM, $sharedKey, OPENSSL_RAW_DATA, $iv);

        return json_decode($decrypted);
    }
}
