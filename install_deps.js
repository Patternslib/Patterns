var bower = require('bower');
var deps = {
	'jcrop': '0.9.12'
}

for (var packg in deps) {
	bower.commands
	.install([packg + '#' + deps[packg]], { save: true }, {})
	.on('end', function (installed) {
	    console.log(installed);
	});
}
