define([
    'require',
    '../lib/jquery'
], function(require) {
    var change = {
        initContent: function(root) {
            $("[data-switch]", root).on("click", function() {
                var options = $(this).attr('data-switch').trim().split(/\s*;\s*/),
                    selector = options[0],
                    $targets = $(selector),
                    values = options[1].split(/\s+/),
                    remove = values[0], prefix = false,
                    add = values[1];
                if (remove.charAt(remove.length - 1) === "*") {
                    remove = remove.slice(0, remove.length - 1);
                    prefix = true;
                }
                $targets.removeClass(function(idx, cls) {
                    return (((prefix) &&
                             (cls.slice(0, remove.length) === remove)) ||
                            (cls === remove)) ? cls : "";
                }).addClass(add);
            });
        }
    };
    return change;
});
