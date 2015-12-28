require('babel-register')

const config = require('../config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')

// const host = process.env.HOST || config.server_host
const port = process.env.PORT || config.server_port || 5000

server.listen(port, function () {
  debug('bin/server is now running at port: ' + port + '.')
})
