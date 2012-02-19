define([
    'require',
    '../lib/jquery',
    '../lib/dist/underscore'
], function(require) {
    var autosubmit = {
        initContent: function(root) {
            $(root).find('.auto-submit').each(function() {
                var $this = $(this),
                    $data = $this.data('auto-submit');
                if (!$data) {
                    var submit = _.debounce(function(event) {
                        $this.submit();
                    }, 400);
                    $this.on("change", submit);
                    $this.find('input').on("keyup", submit);

                    // XXX: test whether on webkit and enable only if supported
                    // XXX: add code to check whether the click actually changed
                    // something
                    $this.find('input[type=search]').on("click", submit);

                    $this.data('auto-submit', true);
                }
            });
        }
    };
    return autosubmit;
});
