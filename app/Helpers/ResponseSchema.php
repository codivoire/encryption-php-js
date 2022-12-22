<?php

namespace App\Helpers;

class ResponseSchema
{
    /** @var int */
    public $status = 200;

    /** @var mixed */
    public $data = null;

    /** @var string */
    public $message = null;

    /** @var mixed */
    public $metadatas = null;

    /** @var mixed */
    public $param = null;

    public function __construct(
        int $status = 200,
        $data = null,
        string $message = null,
        $metadatas = null,
        $param = null,
    ) {
        $this->fill([
            'status' => $status,
            'data' => $data,
            'message' => $message,
            'metadatas' => $metadatas,
            'param' => $param,
        ]);
    }

    public function fill(array $attrs)
    {
        $this->status = $attrs['status'];
        $this->data = $attrs['data'];
        $this->message = $attrs['message'];
        $this->metadatas = $attrs['metadatas'];
        $this->param = $attrs['param'];
    }

    /**
     * Return the response has error
     *
     * @param integer $status
     * @param string|null $message
     */
    public function error(int $status, string $message = null)
    {
        $this->status = $status;
        $this->message = $message ? $message : $this->message;

        return response()->json($this->toArray());
    }

    public function toArray()
    {
        return [
            'status' => $this->status,
            'data' => $this->data,
            'message' => $this->message,
            'metadatas' => $this->metadatas,
            'param' => $this->param,
        ];
    }

    /**
     * Send encrypted response
     */
    public function toEncrypted(string $publicKey)
    {
        $payload = Encryption::encrypt($this, $publicKey);
        return response()->json(['payload' => $payload]);
    }

    public function __call(string $method, array $args)
    {
        if (preg_match('#^with#i', $method) < 1) {
            throw new \Exception("$method is not a property of $this.", 1);
        }

        $attr = strtolower(str_replace('with', '', $method));

        if (!property_exists($this, $attr)) {
            throw new \Exception("$attr is not a property of $this.", 2);
        }

        $this->$attr = $args[0];

        return $this;
    }

    public function __toString()
    {
        return json_encode($this->toArray());
    }
}
