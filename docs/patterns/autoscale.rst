Autoscale
=========

The script scales an element with the `.pat-auto-scale` class by the ratio of its parent width and its own. 
If the pattern is applied to the body, the element is scaled with respect to the viewport's width. Elements 
are automatically updated on window resize.

Scaling is done by setting the `transform: scale(ratio)` css property on the element for browsers that support 
CSS 2D transforms. For other browsers, IE among them, the `zoom` property is used instead.
