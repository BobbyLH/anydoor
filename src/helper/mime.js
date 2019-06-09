const path = require('path')

const mimeType = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'js': 'text/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpg',
  'jpeg': 'image/jpeg',
  'txt': 'text/plain',
  'svg': 'image/svg+xml',
  'xml': 'text/xml'
}

module.exports = filePath => {
  let ext = path.extname(filePath).split('.').pop().toLowerCase()

  if(!ext) {
    ext = filePath
  }

  return mimeType[ext] || mimeType['txt']
}