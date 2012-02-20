/**
 * @license
 * Patterns @VERSION@ parser - argument parser
 *
 * Copyright 2012 Simplon B.V.
 */

function ArgumentParser() {
	this.options = {};
	this.parameters = [];
	this.named_parameters = {};
}


ArgumentParser.prototype = {
    log: function(msg) {
        try {
                console.log(msg);
        } catch(e) {
        }
    },

    add_argument: function(name, default_value) {
            var parameter = {"name" : name,
                            "default": default_value};
            this.parameters.push(parameter);
            this.named_parameters[name] = parameter;
    },

    trim:  function(string) {
	if (String.prototype.trim) {
		// Firefox 3.5+, Safari 5+, IE9+ in standards mode, Chrome 5+,
		// Opera 10.5+
		return string.trim();
	} else {
		// All the rest
		return string.replace(/^\s+|\s+$/g, "");
	}
    },

    parse: function(parameter) {
	var parts = parameter.split(";"),
	    named_param_pattern = /^\s*([a-zA-z]+)\s*:(.*)/,
	    part, matches, i;

	// Popuplate options with default values
	for (i=0; i<this.parameters.length; i++) {
		this.options[this.parameters[i].name] = this.parameters[i]["default"];
	}

	// Grab all positional parameters
	i=-1;
	while (parts.length) {
		i++;
		if (i>=this.parameters.length) {
			break;
		}
		part=this.trim(parts.shift());
                if (!part)
                    continue;
		if (named_param_pattern.test(part)) {
			parts.unshift(part);
			break;
		}
		this.options[this.parameters[i].name] = this.trim(part);
	}

	// Handle all named parameters
	for (i=0; i<parts.length; i++) {
		matches = parts[i].match(named_param_pattern);
		if (!matches) {
			this.log("Positional parameters not allowed after named parameters");
			break;
		}
		if (this.named_parameters[matches[1]]===undefined) {
			this.log("Unknown named parameter " + matches[1]);
			continue;
		}
		this.options[matches[1]] = this.trim(matches[2]);
	}
    }
};

/* jslint devel: true, browser: true, continue: true, sloppy: true, white: true, plusplus: true, regexp: true, indent: 8 
 */
