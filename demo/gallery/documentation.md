# Gallery

## Description
This patterns provides a simple method to create galleries supporting fullscreen
display and touch controls.

## Documentation

Creating a gallery is very simple: just add the `pat-gallery` class to an
element and add links containing an image to it.

    <ul class="pat-gallery">
      <li><a href="images/full/1.jpg"><img src="images/thumb/1.jpg" alt="Image caption"/></a></li>
      <li><a href="images/full/2.jpg"><img src="images/thumb/2.jpg" alt="Image caption"/></a></li>
      <li><a href="images/full/3.jpg"><img src="images/thumb/3.jpg" alt="Image caption"/></a></li>
    </ul>

### Control

The slideshow can be controlled in several ways:

* You can navigate through the images using a mouswheel, swiping or your keyboard.
* Unless explicitly disabled via an option you can start a slideshow of the gallery by clicking
  on the Play-button.
* The imgae caption and toolbar are automatically hidden if they are not used. They can be toggled
  by double-tapping or pressing the space bar.

### Markup details

When looking for images to show in the gallery the pattern looks for links containing an image
anywhere within the gallery container. This allows for different markup structures such as an
unnumered list:

    <ul class="pat-gallery">
      <li><a href="images/full/1.jpg"><img src="images/thumb/1.jpg"/></a></li>
      <li><a href="images/full/2.jpg"><img src="images/thumb/2.jpg"/></a></li>
    </ul>

or a HTML5 `nav` container:

    <nav class="pat-gallery">
      <a href="images/full/1.jpg"><img src="images/thumb/1.jpg"/></a><
      <a href="images/full/2.jpg"><img src="images/thumb/2.jpg"/></a><
    </nav>

The contents of the `alt` attribute of an image will be used as the caption.


### Properties

You can customize the behaviour of a galery through options in the
`data-pat-gallery` attribute.

    <ul class="pat-gallery" data-pat-gallery="autoPlay: true">
      ...
    </ul>

| Property | Default value | Values | Description | Type |
| ----- | --------| -------- | ------- | ----------- |
| `slideshow` | `manual` | `manual` `auto` `none` | Indicates if the gallery should offer a slideshow option (`manual`), should automatically start a slideshow when opened (`auto`) or not allow a slideshow (`none`).| Mutually exclusive |
| `loop` | true | `true` `false` | Indicates if a slideshow should loop back to the beginning.|Mutually exclusive|
| `scale-method` | `fit` | `fit` `fitNoUpscale` `zoom` | How images will fit onto the screen. `fit` ensures the image always fits the screen. `fitNoUpscale` works like `fit` but will never upscale the image. `zoom` the image will always fill the full screen, this may cause the image to be "zoomed" in and cropped.|Mutually exclusive |
| `delay` | `30000` | | The delay, in milliseconds, an image is shown in a slideshow.|Number|
| `effect-duration` | | `250` | How long it will take in milliseconds for an image to slide into view.|Number|
| `effect-easing`  | `ease-out` | | Easing to use when sliding images. This must be a known jQuery easing method. jQuery includes `swing` and `linear`, but more can be included via jQuery UI. | |

