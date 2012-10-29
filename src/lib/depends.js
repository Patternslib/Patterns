define([
    "depends_parse"
], function(parser) {

    function DependsHandler(context, expression) {
        this.context=context;
        this.ast=parser.parse(expression);
    }

    DependsHandler.prototype = {
    };

    return DependsHandler;
});

