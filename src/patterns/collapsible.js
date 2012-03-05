define([
    'require',
    '../lib/jquery'
], function(require) {
    var init = function($this) {
        // create collapsible structure
        var $ctrl = $this.children(':first'),
            $panel = $this.children(':gt(0)')
                .wrapAll('<div class="panel-content" />')
                .parent();

        // set initial state
        if ($this.hasClass("closed")) {
            $panel.toggle();
        } else if (!$this.hasClass("open")) {
            $this.addClass("open");
        }

        // bind to click events
        $ctrl.bind("click", function() {
            if ($this.hasClass('open')) {
                $this.removeClass('open').addClass('closed');
            } else {
                $this.removeClass('closed').addClass('open');
            }
            $panel.slideToggle();
        });
    };

    return init;
});
