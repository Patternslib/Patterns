# Bumper

## Description
A bumper is an element that, when the user starts scrolling, stays within view when a viewport border touches it.

## Documentation
Below is a simple example of a bumper.

    <div class="pat-bumper">
       Bumper content
    </div>

When the user starts scrolling the page and an edge of the above DIV
reaches an edge of the viewport, a *bumped* class will be added.
Additionally, it will be assigned a *bumped-{top|left|right|bottom}*
class depending on which edge of the element was touched by the
viewport. The default classes should look like

    .bumped {
       position: fixed;
    }

    .bumped-top {
       top: 0;
    }

    .bumped-bottom {
       bottom: 0;
    }

    .bumped-left {
       left: 0;
    }

    .bumped-right {
       right: 0;
    }

Please note that classes *bumped-left* and *bumped-right* will not be
assigned at the same time. The same is true for *bumped-top* and
*bumped-bottom*.

Option Reference
----------------

The collapsible can be configured through a `data-pat-bumper` attribute.
The available options are:

<table>
<col width="23%" />
<col width="16%" />
<col width="60%" />
<thead>
<tr class="header">
<th align="left">Field</th>
<th align="left">default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>margin</code></td>
<td align="left"><blockquote>
<p>0</p>
</blockquote></td>
<td align="left">The distance from the edge of the element from which the 'bumped' behavior will be activated</td>
</tr>
</tbody>
</table>
