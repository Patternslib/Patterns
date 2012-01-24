define([
    'require',
    'lib/jquery',
], function(require) {
    var collapsible = {
        initContent: function(root) {
            debugger;
            $(root).find('.collapsible').each(function() {
                var $this = $(this),
                $data = $this.data('collapsible');

                if (!$data) {
                    var $ctrl = $this.children(':first'),
                    $panel = $this.children(':gt(0)')
                        .wrapAll('<div class="panel-content" />')
                        .parent();

                    $this.data('collapsible', true);
                    if ($this.hasClass("closed")) {
                        $panel.toggle();
                    } else if (!$this.hasClass("open")) {
                        $this.addClass("open");
                    }

                    $ctrl.bind("click", function() {
                        if ($this.hasClass('open')) {
                            $this.removeClass('open');
                            $this.addClass('closed');
                        } else {
                            $this.removeClass('closed');
                            $this.addClass('open');
                        }
                        $panel.slideToggle();
                    });
                }
            });
        }
    }
    return collapsible;
});
