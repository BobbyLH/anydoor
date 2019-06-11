const http = require('http')
const chalk = require('chalk')
const conf = require('./config/defaultConfig')
const path = require('path')
const route = require('./helper/route')
const openUrl = require('./helper/open')

class Server {
  constructor (config) {
    this.conf = Object.assign({}, conf, config)
  }

  start () {
    const { root, port, hostname } = this.conf
    const server = http.createServer((req, res) => {
      const url = req.url
      const filePath = path.join(root, url)
      
      route(req, res, filePath, this.conf)
    })
    
    server.listen(port, hostname, () => {
      const addr = `http://${hostname}:${port}`
    
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr)
    })
  }
}

module.exports = Server
