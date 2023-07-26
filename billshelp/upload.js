function(properties, context) {
    let encrypt = context.async(async callback => {
        try {
            let salt = window.crypto.getRandomValues(new Uint8Array(16));
            let iv = window.crypto.getRandomValues(new Uint8Array(16));
            let plain_text = new TextEncoder().encode('hello world');
            console.log(salt);
            console.log(iv);
            console.log(plain_text);
            let encrypt1 = await window.crypto.subtle.importKey("raw", new TextEncoder().encode("my password"), {name: "PBKDF2"}, false, ["deriveBits", "deriveKey"]);
            let encrypt2 = await await window.crypto.subtle.deriveKey(
                {
                  "name": "PBKDF2",
                  "salt": salt,
                  "iterations": 100000,
                  "hash": "SHA-1"
                },
                encrypt1,
                { "name": "AES-CBC", "length": 256},
                true,
                [ "encrypt", "decrypt" ]
            );
            let encrypt3 = await crypto.subtle.exportKey("raw", encrypt2);
            let encrypt4 = btoa(
                new Uint8Array(encrypt3)
                  .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const encrypted = await window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv },
                encrypt2,
                plain_text
            );
            const encryptedBase64 = btoa(
                new Uint8Array(encrypted)
                  .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const encryptedIv = btoa(
                new Uint8Array(iv)
                  .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const encryptedSalt = btoa(
                    new Uint8Array(salt)
                      .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            const results = {
                "encryptedBase64": encryptedBase64,
                "key": encrypt4,
                "iv": encryptedIv, 
                "salt": encryptedSalt
            };
            let responseFetch = await fetch('https://billshelptest.bubbleapps.io/version-test/api/1.1/wf/uploadapi', { // Your POST endpoint
            method: 'POST',
            headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
              "Content-type": "application/json",
              "Authorization": `Bearer a5eb1882585097b75bf05287cfda6841`,
            },
            body: JSON.stringify( { 
                    "file": {
                         "filename": "hello",
                        "private": false,
                        "contents": "hello",
                    },
                    "key": encrypt4, 
                    "iv": encryptedIv,
                    "salt": encryptedSalt,
            }) // This is your file object
          });
            let hello = await responseFetch.json();
            console.log(hello);
            callback(null, hello);
        }
        catch (err) {
            callback(err);
        }
        console.log(encrypt);
    });
}
