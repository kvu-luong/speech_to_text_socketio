const request = require('request')
const fs = require('fs');
function make_request(audio_file_name, session) {
    var headers = {
        'token': 'token'
    };
    var url = "https://vtcc.ai/voice/api/asr/v1/rest/decode_file";
    return new Promise((resolve, reject) => {
        request.post({
            headers: headers,
            url: url, 
            agentOptions: {
                ca: fs.readFileSync('cert.crt')
            },
            formData: {
                file: fs.createReadStream(__dirname +"/audio/"+audio_file_name)
            },
            method: 'POST'
        }, function (e, r, body) {
            if(e) return reject(e);
            var data = {
                'file_name': session,
                'data' : body
            }
            return resolve(data);
        });
    });
}
module.exports = {make_request};