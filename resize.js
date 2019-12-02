const fs = require('fs')
const sharp = require('sharp')

module.exports = function resize(path, format, width) {
    const readStream = fs.createReadStream(path)
    let transform = sharp()

    if (format) {
        transform = transform.toFormat(format)
    }

    if (width) {
        transform = transform.resize(width)
    }

    return readStream.pipe(transform)
};