const fs = require('fs')
const path = require('path')
const HandleBars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const mime = require('./mime')
const compress = require('../helper/compress')
const range = require('../helper/range')
const isFresh = require('../helper/cache')

const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = HandleBars.compile(source.toString())

module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath)
    const contentType = mime(filePath)
    if (stats.isFile()) {
      res.setHeader('Content-Type', contentType)
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data)
      // })
      // fs.createReadStream(filePath).pipe(res)
      if (isFresh(stats, req, res)) {
        res.statusCode = 304
        res.end()
        return
      }
      let rs
      const { code, start, end } = range(stats.size, req, res)
      
      if (code === 200) {
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
      } else if (code === 206) {
        res.statusCode = 206
        rs = fs.createReadStream(filePath, { start, end })
      }

      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res)
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