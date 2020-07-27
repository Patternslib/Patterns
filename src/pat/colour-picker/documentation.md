## Description

A pattern for creating a custom colour picker or polyfill.

## Documentation

This pattern provides a styleable colour picker. It can be used as a fallback
for browsers which don't yet support the HTML5 colour input.

Be sure to include the spectrum.css file, by placing this line in the head of your HTML document.

  <link rel="stylesheet" type="text/css" href="/src/bower_components/spectrum/spectrum.css">

### Examples

####Falling back to the browser's HTML5 picker if available.

  <input type="color" name="color">
    
####Enforcing the styled non-HTML5 picker universally.

By default this pattern will NOT defer to the browser's HTML5 picker.

  <input class="pat-colour-picker" type="color">
