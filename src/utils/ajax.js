const https = require('https')
const http = require('http')
const querystring = require('querystring')
function send(opt) {
    return new Promise((resolve, reject) => {
        const path_params = opt.path_params ? '?' + querystring.stringify(opt.path_params) : ''
        const port = opt.port ? opt.port : '443'
        const timeout = opt.timeout ? opt.timeout : 10000
        const method = opt.method ? opt.method : 'POST'
        const rejectUnauthorized = !opt.rejectUnauthorized ? false : true
        const contentType = opt.contentType ? opt.contentType : 'JSON'
        var headers = opt.headers ? opt.headers : {}
        var http_handler = port == '443' ? https : http
        http_handler = opt.ssl ? https : http_handler
        var sData = ''
        if (opt.data) {
            switch (contentType) {
                case 'form-data':
                    sData = getFormDataString(opt.data)
                    headers['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    headers['Content-Length'] = Buffer.byteLength(sData)
                    break;
                case 'application/x-www-form-urlencoded; charset=UTF-8':
                    sData = getFormDataString(opt.data)
                    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
                    break;

                default:
                    sData = JSON.stringify(opt.data)
                    headers['Content-Type'] = 'application/json'
                    headers['Content-Length'] = Buffer.byteLength(sData)
                    break;
            }

        }
        const oSend = {
            host: opt.host,
            path: opt.path + path_params,
            port,
            method,
            timeout,
            headers,
            rejectUnauthorized
        }
        var httpsRequest = http_handler.request(oSend,
            (response) => {
                var body = []
                response.on('data', function (chunk) {
                    body.push(chunk)
                })
                response.on('end', function () {
                    if (response.statusCode !== 200) {
                        reject("Ajax Error:" + response.statusCode)
                    }
                    resolve(Buffer.concat(body));
                })
            }
        );

        httpsRequest.on('timeout', function (err) {
            console.log("ERROR_SERVER_TIMEOUT", err, oSend)
            var error = ''
            if (err && err.message)
                error = err.message
            reject(Error("ERROR_SERVER_TIMEOUT|" + error))

            var fecha = new Date()
            console.log('error: ', fecha)

        });
        httpsRequest.on('error', function (err) {
            console.log("ERROR_SERVER_ERROR", err, oSend)
            var error = ''
            if (err && err.message)
                error = err.message
            reject(Error("ERROR_SERVER_ERROR|" + error))

        });
        httpsRequest.write(sData);
        httpsRequest.end();
    })
}
function sendUrl(url, base64 = false) {

    // http.get('http://example.com/a-page-which-redirects', function (res) {
    //     // Detect a redirect
    //     if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
    //         // The location for some (most) redirects will only contain the path,  not the hostname;
    //         // detect this and add the host to the path.
    //         if (url.parse(res.headers.location).hostname) {
    //             // Hostname included; make request to res.headers.location
    //         } else {
    //             // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
    //         }

    //         // Otherwise no redirect; capture the response as normal            
    //     } else {
    //         var data = '';

    //         res.on('data', function (chunk) {
    //             data += chunk;
    //         }).on('end', function () {
    //             // Do something with 'data'
    //         });
    //     }
    // });



    return new Promise(async (resolve, reject) => {
        var http_handler = http
        if (url.indexOf('https') > -1)
            http_handler = https
        http_handler.get(url, res => {
            let body = [];
            res.on("data", data => {
                body.push(data)
            });
            res.on("end", () => {
                if (base64)
                    resolve(Buffer.concat(body).toString('base64'))
                else
                    resolve(Buffer.concat(body).toString())
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e)
        });
    });
}

function getFormDataString(data) {
    var postData = ''
    for (key in data) {
        postData += '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"' + key + '\"\r\n\r\n' + data[key] + '\r\n'
    }
    postData += '------WebKitFormBoundary7MA4YWxkTrZu0gW--'
    return postData
}

function getFormDataStringRues(data) {
    var postData = ''
    for (key in data) {
        postData += key + '\: ' + data[key] + '\r\n'
    }
    postData += ''
    return postData
}
module.exports.send = send
module.exports.sendUrl = sendUrl