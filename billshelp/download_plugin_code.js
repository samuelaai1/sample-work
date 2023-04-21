function downloadMore(id) {
    return new Promise((resolve, reject) => {
        let apiData;
        let fileData;

        fetch("https://billshelptest.bubbleapps.io/version-test/api/1.1/wf/downloadapi", {
        method: 'POST',
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
            "Content-type": "application/json",
            "Authorization": "Bearer a5eb1882585097b75bf05287cfda6841",
            "Accept": "*/*",
            "Host": "billshelptest.bubbleapps.io",
            "Connection": "keep-alive"
        },
        body: JSON.stringify({
            "id": id
        })
        })
        .then(response => response.json())
        .then(data => {
            apiData = data;
            fileData = apiData.response;
            resolve(fileData);
        })
        .catch(error => {
            reject(error);
        });
    });
}

const decrypt = (keyData, encryptedBase64, ivData, saltData, fileName) => {
    return new Promise(async (resolve, reject) => {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const fromBase64 = buffer =>
        Uint8Array.from(atob(buffer), c => c.charCodeAt(0));

        const toBase64 = buffer => btoa(
            String.fromCharCode(
                ...new Uint8Array(buffer)
            )
        );

        const encrypted = fromBase64(encryptedBase64);
        const keyArray = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
        const iv = Uint8Array.from(atob(ivData), c => c.charCodeAt(0));
        const salt = Uint8Array.from(atob(saltData), c => c.charCodeAt(0));

        const keyImport = await window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode("my password"),
            {name: 'PBKDF2'},
            false,
            ['deriveKey']
        );

        console.log(keyImport);

        const key = await window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                "salt": salt,
                "iterations": 100000,
                "hash": "SHA-1"
            },
            keyImport,
            { "name": "AES-CBC", "length": 256},
            false,
            [ "encrypt", "decrypt" ]
        );

        const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        encrypted
        );

        const decryptedBase64 = btoa(
            new Uint8Array(decrypted)
                .reduce((data, byte) => data + String.fromCharCode(byte), ''));

        resolve({
            "decryptedArray": decrypted,
            "filename": fileName,
            "decryptedBase64": decryptedBase64
        });
    });
};

function downloadBase64File(dataUrl, fileName) {
    if (fileName.includes("pdf")) {
        const pdfSource = `data:application/pdf;base64,${dataUrl}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return pdfSource
    } else {
        const linkSource = `data:image/jpeg;base64,${dataUrl}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return linkSource;
    }

};

downloadMore(properties.fileuid)
.then(fileData => {
    return fileData;
})
.then(fileData => {
    return decrypt(fileData.key, fileData.file, fileData.iv, fileData.salt, fileData.filename);
})
.then(decryptedStuff => {
    return downloadBase64File(decryptedStuff.decryptedBase64, decryptedStuff.filename);
})
.then(downloadedStuff => {
    console.log(downloadedStuff);
})
.catch(error => {
    console.log(error);
});

function downloadBase64File(dataUrl, fileName) {
    if (fileName.includes("pdf")) {
        const pdfSource = `data:application/pdf;base64,${dataUrl}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return {"name": fileName, "hello": pdfSource}
    } else {
        const linkSource = `data:image/jpeg;base64,${dataUrl}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return {"name": fileName, "hello": linkSource}
    }

};

downloadMore(properties.fileuid)
.then(fileData => {
    return fileData;
})
.then(fileData => {
    return decrypt(fileData.key, fileData.file, fileData.iv, fileData.salt, fileData.filename);
})
.then(decryptedStuff => {
    return downloadBase64File(decryptedStuff.decryptedBase64, decryptedStuff.filename);
})
.then(downloadedStuff => {
    console.log(downloadedStuff);
})
.catch(error => {
    console.log(error);
});