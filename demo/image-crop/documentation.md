# Documentation

An image crop allows a user to interactively crop an image, optionally
previewing the result in real time.

For a very basic usage of this pattern:

    <form action="/some/action">
        ...
        <img src="image-to-crop.jpg" class="pat-image-crop" />
        ...
    </form>

Live Preview
------------

The Image Crop pattern can create a live preview of the cropping
selection. The following html and css fragments illustrate the use of
this feature.

    <div class="preview">
        <img id="crop-preview" src="image-to-crop.jpg" />
    </div>
    ...
    <form action="/some/action">
        ...
        <img src="image-to-crop.jpg" class="pat-image-crop" data-pat-image-crop="preview-id: #crop-preview" />
        ...
    </form>

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

By default, this pattern uses the form ancestor to the trigger image
element. However, a different form can be used by using the form-id
option.

Within the form, the following input fields will be populated:

<table>
<col width="25%" />
<col width="74%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">x1</td>
<td align="left">The x coordinate of the top-left point of the crop.</td>
</tr>
<tr class="even">
<td align="left">y1</td>
<td align="left">The y coordinate of the top-left point of the crop.</td>
</tr>
<tr class="odd">
<td align="left">x2</td>
<td align="left">The x coordinate of the bottom-right point of the crop.</td>
</tr>
<tr class="even">
<td align="left">y2</td>
<td align="left">The y coordinate of the bottom-right point of the crop.</td>
</tr>
<tr class="odd">
<td align="left">w</td>
<td align="left">The width of the cropping area.</td>
</tr>
<tr class="even">
<td align="left">h</td>
<td align="left">The height of the cropping area.</td>
</tr>
</tbody>
</table>

If input fields with those names do not exist within the form, they will
be created. Additionally, the names of the input fields can be prefixed
by using the *input-prefix* option.

Option Reference
----------------

The collapsible can be configured through a `data-pat-image-crop`
attribute. The available options are:

<table>
<col width="25%" />
<col width="15%" />
<col width="58%" />
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>preview-id</code></td>
<td align="left"><blockquote>
<p>''</p>
</blockquote></td>
<td align="left">The ID of the image that will serve as a live preview of the crop process. If empty, the pattern will not display a preview.</td>
</tr>
<tr class="even">
<td align="left"><code>preview-height</code></td>
<td align="left"><blockquote>
<p>0</p>
</blockquote></td>
<td align="left">If a preview element is used, you can optionally specify it's height explicitly. If 0, the preview element's parent height will be used.</td>
</tr>
<tr class="odd">
<td align="left"><code>preview-width</code></td>
<td align="left"><blockquote>
<p>0</p>
</blockquote></td>
<td align="left">Same as above, but for the preview width.</td>
</tr>
<tr class="even">
<td align="left"><code>aspect-ratio</code></td>
<td align="left"><blockquote>
<p>1</p>
</blockquote></td>
<td align="left">The aspect ratio of the cropping area.</td>
</tr>
<tr class="odd">
<td align="left"><code>input-prefix</code></td>
<td align="left"><blockquote>
<p>''</p>
</blockquote></td>
<td align="left">The prefix to be used for the names of the input fields that contain cropping information.</td>
</tr>
<tr class="even">
<td align="left"><code>form-id</code></td>
<td align="left"><blockquote>
<p>''</p>
</blockquote></td>
<td align="left">The ID of the form containing the fields that will be used to save cropping information. If not specified, the form that is ancestor of the trigger element will be used.</td>
</tr>
<tr class="odd">
<td align="left"><code>min-size</code></td>
<td align="left"><blockquote>
<p>0 0</p>
</blockquote></td>
<td align="left">Minimum width and height of the cropped image.</td>
</tr>
<tr class="even">
<td align="left"><code>max-size</code></td>
<td align="left"><blockquote>
<p>0 0</p>
</blockquote></td>
<td align="left">Maximum width and height of the cropped image. Use <code>0 0</code> for unbounded dimensions.</td>
</tr>
<tr class="odd">
<td align="left"><code>initial-sel</code></td>
<td align="left"><blockquote>
<p>0 0 0 0</p>
</blockquote></td>
<td align="left">The coordinates of the top left and bottom right points that define the initial cropping selection. Format: x1 x2 y1 y2</td>
</tr>
</tbody>
</table>
