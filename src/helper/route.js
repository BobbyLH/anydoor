const fs = require('fs')
const path = require('path')
const HandleBars = require('handlebars')
const config = require('../config/defaultConfig')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('./mime')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = HandleBars.compile(source.toString())

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)
    const contentType = mime(filePath)
    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', contentType)
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data)
      // })
      fs.createReadStream(filePath).pipe(res)
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath)
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      const dir = path.relative(config.root, filePath)
      const data = {
        files,
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : ''
      }
      res.end(template(data))
    }
  } catch (error) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html')
    res.end(`${filePath} not exist \n ${error.toString()}`)
  }
}