const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const swig = require('swig')
const router = express.Router();
const app = express();
const Ajax = require('./src/utils/ajax')
const {obtenerDatosMySelf} = require('./src/crypto/crypto')
const cryptoUtils = require('./src/crypto/crypto')
const handlerJs = require('./src/useApp')

global.__crypt = require('./src/crypto/crypto')
obtenerDatosMySelf()
app.use(handlerJs.handler)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname + '/views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });

app.use(fileUpload());

router.get('/', async (req, res) => {
    res.render('login', {});
});

router.post('/login', async (req, res) => {
    try {
        if (!global.__usuarioLlaves || !global.__usuarioLlaves.llave) {
            throw new Error('No existe registro en DynamoDB para el usuario');
        }
        const data = req.body
        const usuario = data.usuario;
        const pass = data.pass;
        const decryptKeyUser = Buffer.from(__usuarioLlaves.llave, 'base64');
        const decryptPass = cryptoUtils.decrypt(pass, decryptKeyUser)
        if (decryptPass === null || usuario !== __usuarioLlaves.name || decryptPass !== __usuarioLlaves.pass) {
            return res.send({ success: false, error: "Las credenciales de usuario no son válidas" });
        }
        var tokenGSE = cryptoUtils.generateTokenD()
        res.send({ success: true, redirect: "/template", token: tokenGSE })
    } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
        const errorMessage = error.message || 'Ocurrió un error en el servidor';
        res.send({ success: false, error: errorMessage});
    }
})

router.get('/template', async (req, res) => {
    res.render('template');
});

router.post('/ccDigital', async (req, res) => {
    try {
        var reqBody = req.body    
        var oBody = {
            ext: reqBody.ext,
            back: reqBody.back,
            front: reqBody.front
        }
        const opt = {
            host: 'http://127.0.0.1',
            port: '3030',
            path: '/logic/cedulaDigitalImg',
            method: 'POST',
            data: oBody,
        }
        const respAjax = await Ajax.send(opt)
        const data = respAjax.toString()
        res.send({ data, success: true })
    }catch (ss) {
        console.log("ERROR_SEND_LOG", ss)
    }

    
})

app.use('/', router);

app.listen(process.env.PORT || 3004, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3004}`);
});

