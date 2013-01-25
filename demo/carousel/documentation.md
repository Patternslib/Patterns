# Documentation

Patterns builds on the excellent
[AnythingSlider](https://github.com/CSS-Tricks/AnythingSlider/wiki)
(licensed under LGPL 3) to provide a very simple way to create
carousels. Just by adding a `pat-carousel` class to your markup you can
turn anything into a beautiful carousel.

Carousels usually use an unnumbered list to define all panels:

    <ul class="pat-carousel">
      <li><img title="Panel 1"/></li>
      <li><img title="Panel 2"/></li>
      <li><img title="Panel 3"/></li>
    </ul>

This is not required though: any element can be used as container and
for panels. For example using a sequence of divs in a section:

    <section class="pat-carousel">
      <div>
        <h2>This is panel 1</h2>
        <p>....</p>
      </div>
      <div>
        <h2>This is panel 2</h2>
        <p>....</p>
      </div>
    </section>

There are no restrictions on the content that you use in a panels: you
can use images, videos, or any other HTML content.

Any links in the page that point directly to a panel will cause the
carousel to jump to the linked panel when clicked.

    <ul class="pat-carousel">
      <li id="intro"><img title="Panel 1"/></li>
      <li id="frontpage"><img title="Panel 2"/></li>
      <li id="reports"><img title="Panel 3"/></li>
    </ul>

    <p>As you can see in the <a href="#reports">reports screenshot</a>
     AcmeReports(TM) can generate beautiful reports.</p>

Such links will automatically get a `current` class when the panel they
are pointing to is displayed.

Lazy loading
------------

The carousel supports lazy loading. To use this simply give your images
a `data-src` attribute. When a panel is about to be displayed the
carousel will move all `data-src` attributes to `src`

    <ul class="pat-carousel">
      <li><img data-src="images/img1.jpg/></li>
      <li><img data-src="images/img2.jpg/></li>
    </ul>

Customizing behaviour
---------------------

The default carousel is quite spartan. You can customize it through
options in the `data-pat-carousel` attribute.

    <ul class="pat-carousel" data-pat-carousel="loop: false; control-arrows: true;">
      <li><img title="Panel 1"/></li>
      <li><img title="Panel 2"/></li>
      <li><img title="Panel 3"/></li>
    </ul>


>    This plugin is not fully stable yet. The availably options and spelling may
>    change in the future.

<table>
<col width="32%" />
<col width="12%" />
<col width="54%" />
<thead>
<tr class="header">
<th align="left">Setting</th>
<th align="left">Default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>auto-play</code></td>
<td align="left">true</td>
<td align="left">Indicates if the carousel should start playing automatically. If <code>control-arrows</code> is enabled users will be able to control this manually.</td>
</tr>
<tr class="even">
<td align="left"><code>loop</code></td>
<td align="left">true</td>
<td align="left">Indicates if the carousel will loop.</td>
</tr>
<tr class="odd">
<td align="left"><code>resize</code></td>
<td align="left">false</td>
<td align="left">If enabled the carousel will be resized to fill its parent.</td>
</tr>
<tr class="even">
<td align="left"><code>expand</code></td>
<td align="left">false</td>
<td align="left">If enable all panels will be resizes to fill the carousel. If not enabled the will dynamically adjust its size to match the currently shown panel.</td>
</tr>
<tr class="odd">
<td align="left"><code>control-arrows</code></td>
<td align="left">false</td>
<td align="left">If enabled back and forward-arrows are are created. Note that users can always use swipes and keyboard to control the carousel as well.</td>
</tr>
<tr class="even">
<td align="left"><code>control-navigation</code></td>
<td align="left">false</td>
<td align="left">If enabled a list of links to navigate within the carousel is created.</td>
</tr>
<tr class="odd">
<td align="left"><code>control-startstop</code></td>
<td align="left">false</td>
<td align="left">If enabled a button to start and stop carousel animation is added.</td>
</tr>
<tr class="even">
<td align="left"><code>time-delay</code></td>
<td align="left">3000</td>
<td align="left">The time in milliseconds a single panel is shown when animation is active.</td>
</tr>
<tr class="odd">
<td align="left"><code>time-animation</code></td>
<td align="left">600</td>
<td align="left">The duration of a transition animation in milliseconds.</td>
</tr>
</tbody>
</table>

