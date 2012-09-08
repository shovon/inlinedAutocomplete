ejs = require 'ejs'
fs  = require 'fs'

task "compile-ejs", "Compiles the bin/demo/index.ejs file into an HTML file.", ->
    file = fs.readFileSync 'bin/demo/index.ejs', 'utf8'
    output = ejs.render file, build: true
    fs.writeFileSync 'bin/demo/index.html', output, 'utf8'