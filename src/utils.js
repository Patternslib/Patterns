define({
    parseOptions: function(input) {
        var params = input.split("!"),
        options = {}, name, value, index;

        for (var i=0; i<params.length; i++) {
            index = params[i].indexOf("=");
            if (index === -1) {
                name = params[i];
                value = true;
            } else {
                name = params[i].slice(0, index);
                value = params[i].slice(index+1);
            }
            options[name] = value;
        }
        return options;
    }
});
