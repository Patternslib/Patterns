Image Crop
==========

An image crop allows a user to interactively crop an image, optionally previewing the result
in real time.

For a very basic usage of this pattern:

.. code-block:: html

    <form action="/some/action">
        ...
        <img src="image-to-crop.jpg" class="pat-image-crop" />
        ...
    </form>

Live Preview
------------

The Image Crop pattern can create a live preview of the cropping selection. The
following html and css fragments illustrate the use of this feature.

.. code-block:: html
    <div class="preview">
        <img id="crop-preview" src="image-to-crop.jpg" />
    </div>
    ...
    <form action="/some/action">
        ...
        <img src="image-to-crop.jpg" class="pat-image-crop" data-pat-image-crop="preview-id: #crop-preview" />
        ...
    </form>

.. code-block:: css

    .preview {
        width: 168px;
        height: 168px;
        overflow: hidden;
    }

    .preview img {
        width: auto;
        height: auto;
        margin: 0;
        padding: 0;
    }

Form Elements
-------------

By default, this pattern uses the form ancestor to the trigger image element. However,
a different form can be used by using the form-id option.

Within the form, the following input fields will be populated:

+--------------------+------------------------------------------------------------+
| Name               | Description                                                |
+====================+============================================================+
| x1                 | The x coordinate of the top-left point of the crop.        |
+--------------------+------------------------------------------------------------+
| y1                 | The y coordinate of the top-left point of the crop.        |
+--------------------+------------------------------------------------------------+
| x2                 | The x coordinate of the bottom-right point of the crop.    |
+--------------------+------------------------------------------------------------+
| y2                 | The y coordinate of the bottom-right point of the crop.    |
+--------------------+------------------------------------------------------------+
| w                  | The width of the cropping area.                            |
+--------------------+------------------------------------------------------------+
| h                  | The height of the cropping area.                           |
+--------------------+------------------------------------------------------------+

If input fields with those names do not exist within the form, they will be created.
Additionally, the names of the input fields can be prefixed by using the *input-prefix*
option.

Option Reference
----------------

The collapsible can be configured through a ``data-pat-image-crop`` attribute.
The available options are:

+--------------------+------------+-----------------------------------------------+
| Field              | default    | Description                                   |
+====================+============+===============================================+
| ``preview-id``     |   ''       | The ID of the image that will serve as a      |
|                    |            | live preview of the crop process. If empty,   |
|                    |            | the pattern will not display a preview.       |
+--------------------+------------+-----------------------------------------------+
| ``preview-height`` |   0        | If a preview element is used, you can         |
|                    |            | optionally specify it's height explicitly. If |
|                    |            | 0, the preview element's parent height will   |
|                    |            | be used.                                      |
+--------------------+------------+-----------------------------------------------+
| ``preview-width``  |   0        | Same as above, but for the preview width.     |
+--------------------+------------+-----------------------------------------------+
| ``aspect-ratio``   |   1        | The aspect ratio of the cropping area.        |
+--------------------+------------+-----------------------------------------------+
| ``input-prefix``   |   ''       | The prefix to be used for the names of the    |
|                    |            | input fields that contain cropping            |
|                    |            | information.                                  |
+--------------------+------------+-----------------------------------------------+
| ``form-id``        |   ''       | The ID of the form containing the fields that |
|                    |            | will be used to save cropping information.    |
|                    |            | If not specified, the form that is ancestor   |
|                    |            | of the trigger element will be used.          |
+--------------------+------------+-----------------------------------------------+
| ``min-size``       |  0 0       | Minimum width and height of the cropped       |
|                    |            | image.                                        |
+--------------------+------------+-----------------------------------------------+ 
| ``max-size``       |  0 0       | Maximum width and height of the cropped       |
|                    |            | image. Use ``0 0`` for unbounded dimensions.  | 
+--------------------+------------+-----------------------------------------------+
| ``initial-sel``    |  0 0 0 0   | The coordinates of the top left and bottom    |
|                    |            | right points that define the initial cropping |
|                    |            | selection. Format: x1 x2 y1 y2                |
+--------------------+------------+-----------------------------------------------+

