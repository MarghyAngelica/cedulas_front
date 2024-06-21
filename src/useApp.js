const private = [
    '/template'
]

const handler = async (req, res, next) => {
    try {
        var token = extraerToken(req)
        const context = req.url.split("?")
        if (private.indexOf(context[0]) == -1) {
            next();
            return;
        }
        if (token) {
            await __crypt.validateTokenFn(token)
            next()
            return token
        }
        throw Error("NO_TOKEN")
    } catch (e) {
        res.send('Token no valido, error: ', e)
    }
}

const extraerToken = (req) => {
    try {
        /*
            Via URL
            */
        var token = req.query.q
        if (!token) {
            /*
            Via header
            */
            token = req.headers['token-gse']
        } else {
            token = decodeURIComponent(token)
        }
        return token
    } catch (e) {
        console.log('error:: ', e)
    }

}
module.exports.handler = handler