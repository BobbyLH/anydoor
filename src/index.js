const yargs = require('yargs')
const Server = require('./app')

const argv = yargs.usage('anywhere [option]').option('p', {
  alias: 'port',
  describe: '端口号',
  default: 9527
}).option('h', {
  alias: 'hostname',
  describe: 'houst',
  default: '127.0.0.1'
}).option('r', {
  alias: 'root',
  describe: '根目录',
  default: process.cwd()
}).version().alias('v', 'version').help().argv

const server = new Server(argv)
server.start()