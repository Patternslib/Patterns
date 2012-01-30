define([
    'require',
    '../lib/jquery'
], function(require) {
    var autosubmit = {
        initContent: function(root) {
            $(root).find('.auto-submit').each(function() {
                var $this = $(this),
                    $data = $this.data('auto-submit');
                if (!$data) {
                    $this.on("change", function(event) {
                        $this.submit();
                    });
                    $this.data('auto-submit', true);
                }
            });
        }
    };
    return autosubmit;
});
