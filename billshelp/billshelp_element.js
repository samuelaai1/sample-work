var file;
    var fileName;

    var input = $('<div id="file"><input type="file" class="custom-file-input" id="file-upload"/><label for="file-upload" class="custom-file-label">Click to select files to upload</label></div>');

// Make sure id for button that triggers the upload has the HTML ID 'trigger2'. 
// You can replace 'trigger2' if required, just make sure the values match 

    var button = document.getElementById('trigger2');

    instance.canvas.append(input);

// Get file from file input defiend by var input above

    var fileInput = document.getElementById('file-upload');

// Defining function readFile (get base64 string of file)

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
            resolve(reader.result);
            };
            reader.onerror = () => {
            reject(reader.error);
            };
            reader.readAsDataURL(file);
        });
    }

// Defining function encrypt (used to encrypt base64 string)
// For explanation of the terms salt and iv, see this webpage: https://dev.to/halan/4-ways-of-symmetric-cryptography-and-javascript-how-to-aes-with-javascript-3o1b

    const encrypt = textToEncrypt => {
        return new Promise(async (resolve, reject) => {
            try {
                const fromBase64 = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
                let salt = window.crypto.getRandomValues(new Uint8Array(16));
                let iv = window.crypto.getRandomValues(new Uint8Array(16));
                let fileData = textToEncrypt.replace(/^.+,/, '');
                let plain_text = fromBase64(fileData);
                //let plain_text = new TextEncoder().encode(textToEncrypt);
                let key1 = await window.crypto.subtle.importKey("raw", new TextEncoder().encode("my password"), {name: "PBKDF2"}, false, ["deriveBits", "deriveKey"]);
                console.log(key1);
                let key2 = await window.crypto.subtle.deriveKey(
                    {
                        "name": "PBKDF2",
                        "salt": salt,
                        "iterations": 100000,
                        "hash": "SHA-1"
                    },
                    key1,
                    { "name": "AES-CBC", "length": 256},
                    true,
                    [ "encrypt", "decrypt" ]
                );
                console.log(key2);
                let key3 = await crypto.subtle.exportKey("raw", key2);
                console.log(key3);
                let key4 = btoa(new Uint8Array(key3).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                console.log(key4);
                const encrypted = await window.crypto.subtle.encrypt(
                    {name: "AES-CBC", iv },
                    key2,
                    plain_text
                );
                const encryptedBase64 = btoa(new Uint8Array(encrypted).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                const encryptedIv = btoa(new Uint8Array(iv).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                //console.log(encryptedIv);
                const encryptedSalt = btoa(new Uint8Array(salt).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                //console.log(encryptedSalt);
                resolve({ encrypted, encryptedBase64, encryptedIv, encryptedSalt, key1, key2, key3, key4, iv, salt, plain_text });
            } catch (err) {
                reject(err);
            }
        });
    };

// When file is selected through HTML file input element, extract file name

    fileInput.addEventListener('change', (e) => {
        file = e.target.files[0];
        const fileName = file.name;
        instance.publishState("filename", fileName)
    });

// When button is clicked, run function readFile and then function encryptedData .
// Then push values to custom states using instance.publishState

    button.addEventListener('click', (e) => {
        if (document.getElementById("file-upload").files.length == 0) {
            window.alert("Please select file before progressing")

        } else {
            readFile(file)
            .then(fileData => encrypt(fileData))
            .then(encryptedData => {
                instance.publishState("filebody", encryptedData.encryptedBase64);
                instance.publishState("key", encryptedData.key4);
                instance.publishState("iv", encryptedData.encryptedIv);
                instance.publishState("salt", encryptedData.encryptedSalt);
                instance.triggerEvent("click");
            })
            .catch(error => {
                console.error(error);
            });
        }
