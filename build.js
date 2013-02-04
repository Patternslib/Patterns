#!/usr/bin/env node

var program = require('commander'),
    crypto = require('crypto'),
    fs = require('fs'),
    git = require('git-rev'),
    path = require('path'),
    rimraf = require('rimraf'),
    spawn = require('child_process').spawn;

function list(val) {
      return val.split(',');
}

program
    .option('-n, --no-minify', 'Do no minify package')
    .option('-t, --tag [version]', 'Build specific version')
    .option('-m, --modules [module1,module2,...]',
            'Include only these modules in bundle', list)
    .parse(process.argv);

var build = function(tag, cleanup) {
    var filename;
    if (program.modules) {
        // User wants a custom bundle
        var patterns = program.modules.sort().join('&'),
            shasum = crypto.createHash('sha1');
        shasum.update(tag + '?' + patterns);

        var hex = shasum.digest('hex').substr(0,8);
        filename = 'patterns-' + tag+ '-' + hex + (program.minify?'.min':'') + '.js';
    } else {
        filename = 'patterns-' + tag + (program.minify?'.min':'') + '.js';
    }

    var modules = program.modules || ['main'];
    modules = modules.sort();

    // Generate args that are passed to jam
    var fullname = path.join(__dirname, 'bundles', filename);

    // The CLI interface is:
    // jam compile -i pat1 [-i pat2 [-i pat3]] -o outfile
    var args = [ 'compile' ].concat(['--almond', '--verbose', '-i']).
        concat(modules.join(' -i ').split(' ')).concat(['-o', fullname]);

    if (!program.minify)
        args.push('--no-minify');

    var p = spawn(path.join(__dirname, './node_modules/.bin/jam'), args);
    p.stdout.on('data', function(data){
        console.log('stdout ' + data);
    });
    p.stderr.on('data', function(data){
        console.log('stderr ' + data);
    });
    p.on('exit', function(code) {
        if (code === 0) {
            fs.open(fullname, 'a+', parseInt('0666', 8), function(err, fd){
                if (err) {
                    console.log(err);
                    return cleanup();
                }
                if (modules.indexOf('main') == -1) {
                    var deps = modules
                        .map(function(e){ return '"'+e+'"';  })
                        .join(', ');

                    var code = "require(['registry', " + deps +
                        "], function(r){r.init();});";
                } else {
                    var code = "require(['main']);";
                }
                fs.write(fd, code, null, undefined,
                    function(err, written, buffer){
                        if (err) {
                            console.log(err);
                            return cleanup();
                        }
                        fs.close(fd, function(){
                            var link = path.join(__dirname, 'bundles',
                                'patterns' + (program.minify?'.min':'') + '.js');
                            if (fs.existsSync(link)) {
                                fs.unlinkSync(link);
                            }
                            fs.symlinkSync(filename, link);
                            console.log('Great success!');
                            return cleanup();
                        });
                });
            });
        } else {
            console.log('Build failed ...');
            return cleanup();
        }
    });
    return;
};


var checkout = function(tmpdir, tag) {
    var p = spawn('git', ['checkout', program.tag]);

    p.stdout.on('data', function(data){
        console.log('stdout ' + data);
    });
    p.stderr.on('data', function(data){
        console.log('stderr ' + data);
    });

    p.on('exit', function(code, status){
        if (code === 0) {
            build(tag, function(){
                rimraf.sync(tmpdir);
                process.exit(1);
            });
        } else {
            console.log('could not checkout tag ' + tag);
            process.exit(1);
        }
    });
};

var clone = function(tmpdir, tag) {
    var p = spawn('git', ['clone', '-s', '.', tmpdir]);

    p.stdout.on('data', function(data){
        console.log('stdout ' + data);
    });
    p.stderr.on('data', function(data){
        console.log('stderr ' + data);
    });

    p.on('exit', function(code, status){
        if (code === 0) {
            try {
                process.chdir(tmpdir);
            } catch(err) {
                console.log('chdir: ' + err);
                process.exit(1);
            }
            checkout(tmpdir, tag);
        } else {
            console.log('could not clone');
            process.exit(1);
        }
    });

};


if (program.tag) {
    var randChar = function() {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        return chars[Math.floor(Math.random() * chars.length)];
    };
    var tmpdir;
    do {
        tmpdir = '/tmp/' + Array(8).join('.').split('').map(randChar).join('');
    } while(fs.existsSync(tmpdir));
    clone(tmpdir, program.tag);
} else {
    git.tag(function (tag) {
        build(tag, function(){});
    });
}

