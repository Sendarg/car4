var keythereum = require("keythereum");
var createKeccakHash = require("keccak/js");


function isFunction(f) {
    return typeof f === "function";
}

function keccak256(buffer) {
    return createKeccakHash("keccak256").update(buffer).digest();
}


const keyManager = {

    /**
     * 获取私钥 入参有钱包文件
     */
    recover2(keyObject, password, type, cb) {
        // console.warn('recover2--->',keyObject);
        try {
            this._insetRecover(keyObject, password, type, cb)
        } catch (e) {
            cb(-100)
        }
    },
    _insetRecover(keyObject, password, type, cb) {
        var keyObjectCrypto, iv, salt, ciphertext, algo;
        var self = keythereum;
        var privateKey = '';
        keyObjectCrypto = keyObject.Crypto || keyObject.crypto;

        function verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo) {
            var key;
            if (self.getMAC(derivedKey, ciphertext) !== keyObjectCrypto.mac) {
                return null;
            }
            if (keyObject.version === "1") {
                key = keccak256(derivedKey.slice(0, 16)).slice(0, 16);
            } else {
                key = derivedKey.slice(0, 16);
            }
            return self.decrypt(ciphertext, key, iv, algo);
        }

        iv = self.str2buf(keyObjectCrypto.cipherparams.iv);
        salt = self.str2buf(keyObjectCrypto.kdfparams.salt);
        ciphertext = self.str2buf(keyObjectCrypto.ciphertext);
        algo = keyObjectCrypto.cipher;

        if (keyObjectCrypto.kdf === "pbkdf2" && keyObjectCrypto.kdfparams.prf !== "hmac-sha256") {
            if (!isFunction(cb)) {
                return null;
            } else {
                cb(2, null);
            }
        }

        if (!isFunction(cb)) {
            privateKey = verifyAndDecrypt(self.deriveKey(password, salt, keyObjectCrypto), salt, iv, ciphertext, algo);
            if (privateKey) {
                privateKey = privateKey.toString('hex');
            }
            return privateKey;
        } else {
            self.deriveKey(password, salt, keyObjectCrypto, function (derivedKey) {
                var err = 0;
                privateKey = verifyAndDecrypt(derivedKey, salt, iv, ciphertext, algo);
                if (!privateKey) {
                    err = 1;
                } else {
                    if (type === 'hex') {
                        privateKey = privateKey.toString('hex');
                    }
                }
                cb(err, privateKey);
            });
        }
    }
};

export default keyManager;

