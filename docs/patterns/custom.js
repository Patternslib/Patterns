define([
    "registry",
], function(registry) {
   var _ = {
        name: "custom",
        trigger: ".pat-custom"
    };

    registry.register(_);
    return _;
});
