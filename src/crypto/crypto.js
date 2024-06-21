const crypto = require('crypto')

const obtenerDatosMySelf = () => {
    const keyBase="yApyOE/8k2D/s0NLTr7Tzy1iHUC3TwDYWyuBFa9z8RI="
    var oDataUser = {
        name:'myself',
        pass:'',
        llave: 'LS+1TPwWe0xquDPDoc87dJ1Vg2DYUMSunod65ebO74o1ElCt4QkmtzV3CCw6VeRU='
    }
    var keyCrypt = oDataUser.llave
    var key = decrypt(keyCrypt.toString(),Buffer.from(keyBase, 'base64'))
    oDataUser.llave = key
    oDataUser.pass = 'm7s2lf!'
    global.__usuarioLlaves = oDataUser;    
};

function decrypt (passEncrypted, keyCrypt) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-ecb', keyCrypt, '');
        let decryptedData = decipher.update(passEncrypted, 'base64', 'utf8');
        decryptedData += decipher.final('utf8');
        return decryptedData;
    } catch (error) {
        console.error('Error during decryption:', error);
        return null;
    }
}
function generateTokenD() {
    const keyCrypt = Buffer.from("yApyOE/8k2D/s0NLTr7Tzy1iHUC3TwDYWyuBFa9z8RI=", 'base64');

    function encriptar(text, keyCrypt) {
        var cipher = crypto.createCipheriv('aes-256-ecb', keyCrypt, '')
        var crypted = cipher.update(text, 'utf8', 'base64')
        crypted += cipher.final('base64');
        return crypted;
    }

    function generarTimestamp() {
        var fechaActual = new Date();
        fechaActual.setMinutes(fechaActual.getMinutes() + 5)
        const timestamp = Math.floor(fechaActual.getTime() / 1000)
        return timestamp.toString()
    }

    var dataCrypt = encriptar(generarTimestamp(), keyCrypt);
    return dataCrypt
}
module.exports.obtenerDatosMySelf = obtenerDatosMySelf
module.exports.decrypt = decrypt
module.exports.generateTokenD = generateTokenD