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
    .option('--no-symlink', 'Do not symlink new bundle')
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
    var args = [
            'build',
            '--almond',
            '--verbose',
            '-i', modules.join(','),
            '-o', fullname
            ];

    if (!program.minify)
        args.push('--no-minify');

    var p = spawn(path.join(__dirname, 'node_modules/.bin/bungle'), args);
    p.stdout.on('data', function(data){
        console.log(data.toString());
    });
    p.stderr.on('data', function(data){
        console.log('stderr ' + data);
    });
    p.on('exit', function(code) {
        if (code === 0) {
            var header = "/**\n" +
                " * Patterns bundle " + tag + (hex?"-"+hex:"") + "\n" +
                " *\n" +
                " * See http://patternslib.com/ for more information.\n" +
                " *\n";
            if (modules.indexOf('main') === -1) {
                header += " * Included patterns:\n * - ";
                header += program.modules.sort().join("\n * - ") + "\n";
            }
            header += " */\n\n";

            var js = fs.readFileSync(fullname);

            var init = '';
            var deps = modules
                    .map(function(e){ return '"'+e+'"';  })
                    .join(', ');

            init = "require(['core/registry', " + deps +
                "], function(r){r.init();});";

            var stream = fs.createWriteStream(fullname);
            stream.write(header + js + init);
            stream.end();
            if (program.symlink) {
                var link = path.join(__dirname, 'bundles',
                    'patterns' + (program.minify?'.min':'') + '.js');
                if (fs.existsSync(link)) {
                    fs.unlinkSync(link);
                }
                fs.symlinkSync(filename, link);
            }
            console.log('Great success!');
            return cleanup();
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
                process.exit(0);
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
        tmpdir = '/tmp/patterns-' + Array(8).join('.').split('').map(randChar).join('');
    } while(fs.existsSync(tmpdir));
    clone(tmpdir, program.tag);
} else {
    git.tag(function (tag) {
        build(tag, function(){});
    });
}

