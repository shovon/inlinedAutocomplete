# Just throw this in a random project directory, run it with
# coffee <path to this file>, and watch it magically serve the files from within
# that directory.
#
# It can also accept a parameter for the port number. Defaults to 3000.
#
# Thanks to @balupton (http://github.com/balupton), for creating the script in
# http://github.com/balupton/simple-server.
#
# Just be sure to install express and connect-coffee-script, via
# `npm install express`.

# Requirements
express        = require('express')
path           = require('path')
lessMiddleware = require 'less-middleware'
ejsMiddleware  = require 'ejs-middleware'

# Variables
publicPath = path.resolve('.')
port = process.argv[2]||3000

# Create Server
server = express()

# Configure
server.configure ->
    # Standard
    server.use express.errorHandler()
    server.use express.bodyParser()
    server.use express.methodOverride()

    # Routing
    server.use server.router

    server.use lessMiddleware
        src: publicPath

    server.use ejsMiddleware publicPath

    server.use express.static publicPath
    server.use express.directory publicPath

# Listen
server.listen port

console.log "Server listening on port #{port}."
