import { md, pki, util, random, cipher } from "node-forge";

class Encryption {
  /**
   * @param {string} uuid
   */
  constructor(uuid) {
    /** @type {string} */
    this.algorithm = "AES-256-CBC";

    /** @type {pki.rsa.KeyPair} */
    this.keypair = null;

    /** @type {string} */
    this.sharedKey = null;

    /** @type {string} */
    this.uuid = null;

    if (typeof uuid === "string") {
      this.uuid = uuid;
    }
  }

  /**
   * Get key in pem format
   *
   * @param {'publicKey'|'privateKey'} keyName
   */
  toPem(keyName) {
    let pem = "";

    if (keyName === "publicKey") {
      pem = pki.publicKeyToPem(this.keypair.publicKey);
    } else {
      pem = pki.privateKeyToPem(this.keypair.privateKey);
    }

    return pem;
  }

  /**
   * @param {string} data
   */
  encrypt(data) {
    const iv = random.getBytesSync(16);
    const blockCipher = cipher.createCipher(this.algorithm, this.sharedKey);

    blockCipher.start({ iv: iv });
    blockCipher.update(util.createBuffer(JSON.stringify(data), "utf8"));
    blockCipher.finish();

    return util.encode64(iv + blockCipher.output.data);
  }

  /**
   * @param {string} base64
   */
  decrypt(base64) {
    const decoded = util.decode64(base64);
    const iv = decoded.substring(0, 16);
    const cipherText = decoded.substring(16);
    const decipher = cipher.createDecipher("AES-CBC", this.sharedKey);

    decipher.start({ iv: iv });
    decipher.update(util.createBuffer(cipherText));
    decipher.finish();

    return JSON.parse(decipher.output.data);
  }

  /**
   * @param {string} base64
   */
  decryptSharedKey(base64) {
    const encrypted = util.decode64(base64);
    this.sharedKey = this.keypair.privateKey.decrypt(encrypted);

    return this;
  }

  /**
   * Generate KeyPair
   *
   * @returns {Promise<pki.rsa.KeyPair>}
   */
  generate() {
    return new Promise((resolve, reject) => {
      pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (e, k) =>
        e ? reject(e) : resolve(k)
      );
    });
  }

  storeHandshakeId(handshakeId) {
    localStorage.setItem("encryption_uuid", handshakeId);
  }

  /**
   * Store public & private keys in PEM string
   *
   * @param {pki.rsa.KeyPair} keyPair
   */
  storeKeyPairToPem(keyPair) {
    const pubicPem = pki.publicKeyToPem(keyPair.publicKey);
    const privatePem = pki.privateKeyToPem(keyPair.privateKey);

    localStorage.setItem("encryption_keypair_public", pubicPem);
    localStorage.setItem("encryption_keypair_private", privatePem);
  }

  getKeysFromStore() {
    const publicKey = localStorage.getItem("encryption_keypair_public");
    const privateKey = localStorage.getItem("encryption_keypair_private");

    return { publicKey, privateKey };
  }

  /**
   * Get keyPair from pem
   *
   * @param {string} publicKeyPem
   * @param {string} privateKeyPem
   * @returns {pki.rsa.KeyPair}
   */
  keyPairFromPem(publicKeyPem, privateKeyPem) {
    const publicKey = pki.publicKeyFromPem(publicKeyPem);
    const privateKey = pki.privateKeyFromPem(privateKeyPem);

    return { publicKey, privateKey };
  }

  /**
   * Verify keypair matches
   *
   * @param {string} publicKeyPem
   * @param {string} privateKeyPem
   */
  verify(publicKeyPem, privateKeyPem) {
    const keyPair = this.keyPairFromPem(publicKeyPem, privateKeyPem);
    const newMd = md.sha1.create().update("encryption", "utf8");

    return keyPair.publicKey.verify(
      newMd.digest().bytes(),
      keyPair.privateKey.sign(newMd)
    );
  }
}

export default Encryption;
