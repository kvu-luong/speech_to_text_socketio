class ValidateFile{
    static  isAudio(filename) {
        console.log(filename);
        var parts = filename.split('.');
        var ext =  parts[parts.length - 1];
        switch (ext.toLowerCase()) {
        case 'wav':
        case 'mp3':
            return true;
        }
        return false;
    }
}
module.exports = { ValidateFile }