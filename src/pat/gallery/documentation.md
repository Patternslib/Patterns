## Description

This pattern provides a simple method to create galleries supporting fullscreen
display and touch controls.

## Documentation

Creating a gallery is very simple: just add the `pat-gallery` class to an
element and add links containing an image to it.

    <ul class="pat-gallery">
      <li><a href="full1.jpg"><img src="thumb1.jpg" title="Image 1 caption"/></a></li>
      <li><a href="full2.jpg"><img src="thumb2.jpg" title="Image 2 caption"/></a></li>
      <li><a href="full3.jpg"><img src="thumb3.jpg" title="Image 3 caption"/></a></li>
    </ul>

### Control

The slideshow can be controlled in several ways:

- You can navigate through the images using a mouse wheel, swiping or your keyboard.
- Unless explicitly disabled via an option you can start a slideshow of the gallery by clicking on the Play-button.
- The image caption and toolbar are automatically hidden if they are not used. They can be toggled by double-tapping or pressing the space bar.

### Markup details

When looking for images to show in the gallery the pattern looks for links containing an image anywhere within the gallery container. This allows for different markup structures such as an unnumbered list:

    <ul class="pat-gallery">
      <li><a href="images/full/1.jpg"><img src="images/thumb/1.jpg"/></a></li>
      <li><a href="images/full/2.jpg"><img src="images/thumb/2.jpg"/></a></li>
    </ul>

or a HTML5 `nav` container:

    <nav class="pat-gallery">
      <a href="images/full/1.jpg"><img src="images/thumb/1.jpg"/></a>
      <a href="images/full/2.jpg"><img src="images/thumb/2.jpg"/></a>
    </nav>

The contents of the `title` attribute of an image will be used as the caption.


### Option reference

You can customise the behaviour of a gallery through options in the
`data-pat-gallery` attribute.

    <ul class="pat-gallery" data-pat-gallery="autoPlay: true">
      ...
    </ul>

| Property | Default value | Values | Description | Type |
| ----- | --------| -------- | ------- | ----------- |
| `loop` | true | `true` `false` | Indicates if a slideshow should loop back to the beginning.|Mutually exclusive|
| `scale-method` | `fit` | `fit` `fitNoUpscale` `zoom` | How images will fit onto the screen. `fit` ensures the image always fits the screen. `fitNoUpscale` works like `fit` but will never upscale the image. `zoom` the image will always fill the full screen, this may cause the image to be "zoomed" in and cropped.|Mutually exclusive |
| `delay` | `30000` | | The delay, in milliseconds, an image is shown in a slideshow.|Number|
| `effect-duration` | | `250` | How long it will take in milliseconds for an image to slide into view.|Number|
