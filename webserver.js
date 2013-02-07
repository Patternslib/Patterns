var express = require('express'),
    http = require('http'),
    path = require('path'),
    git = require('git-rev'),
    spawn = require('child_process').spawn,
    crypto = require('crypto'),
    fs = require('fs');

var app = express(),
    debug = process.env.DEBUG || false,
    tag;

var error_message = "Could not build bundle at this time. Please try again later.";

app.configure(function(){
    app.set('host', process.env.HOST || '127.0.0.1');
    app.set('port', process.env.PORT || 2652);
    app.use(express.logger());
    app.use(express.compress());
});

git.tag(function (str) {
    tag = str;
});

var bundleBuilder = function(req, res, min){
    var version = req.params.version || tag;
    var query = req.query;

    var filename;
    if (Object.keys(query).length > 0) {
        // User want a custom bundle
        var patterns = Object.keys(query).sort().join('&'),
            shasum = crypto.createHash('sha1');
        shasum.update(tag + '?' + patterns);

        var hex = shasum.digest('hex').substr(0,8);
        filename = 'patterns-' + version + '-' + hex + (min?'.min':'') + '.js';
    } else {
        filename = 'patterns-' + version + (min?'.min':'') + '.js';
    }

    // Generate args that are passed to jam
    var fullname = path.join(__dirname, 'bundles', filename);

    // The CLI interface is:
    // jam compile -i pat1 [-i pat2 [-i pat3]] -o outfile
    var args = [ '--no-symlink' ]
        .concat(['-m', Object.keys(query).sort().join(',')]);
    if (!min)
        args.push('-n');

    if (!fs.existsSync(fullname)) {
        // Not in cache, so generate
        var p = spawn('./build.js', args);

        if (debug) {
            p.stdout.on('data', function(data){
                console.log('stdout ' + data);
            });
            p.stderr.on('data', function(data){
                console.log('stderr ' + data);
            });
        }
        p.on('exit', function(code) {
            if (code === 0) {
                return res.download(fullname);
            } else {
                return res.send(error_message);
            }
        });
        return;
    }
    return res.download(fullname);
};

app.get('/getBundle', function(req, res){
    var minify = req.query.minify === 'minify';
    delete req.query.minify;
    bundleBuilder(req, res, minify);
});

app.get('/bundles/:name', function(req, res){
    var fullname = path.join(__dirname, 'bundles', req.params.name);
    return res.download(fullname);
});

app.use(express.static(path.join(__dirname)));

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log("Express server listening on: http://" + app.get('host') + ':' + app.get('port'));
});

