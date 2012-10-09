Carousels
=========

Patterns builds on the excellent `AnythingSlider
<https://github.com/CSS-Tricks/AnythingSlider/wiki>`_ (licensed under LGPL 3) to
provide a very simple way to create carousels. Just by adding a ``pt-carousel``
class to your markup you can turn anything into a beautiful carousel.

Carousels usually use an unnumbered list to define all panels:

.. code-block:: html

   <ul class="pt-carousel">
     <li><img title="Panel 1"/></li>
     <li><img title="Panel 2"/></li>
     <li><img title="Panel 3"/></li>
   </ul>


This is not required though: any element can be used as container and for
panels. For example using a sequence of divs in a section:

.. code-block:: html

   <section class="pt-carousel">
     <div>
       <h2>This is panel 1</h2>
       <p>....</p>
     </div>
     <div>
       <h2>This is panel 2</h2>
       <p>....</p>
     </div>
   </section>

There are no restrictions on the content that you use in a panels: you can use
images, videos, or any other HTML content.

Any links in the page that point directly to a panel will cause the carousel
to jump to the linked panel when clicked.

.. code-block:: html

   <ul class="pt-carousel">
     <li id="intro"><img title="Panel 1"/></li>
     <li id="frontpage"><img title="Panel 2"/></li>
     <li id="reports"><img title="Panel 3"/></li>
   </ul>

   <p>As you can see in the <a href="#reports">reports screenshot</a>
    AcmeReports(TM) can generate beautiful reports.</p>


Customizing behaviour
---------------------

The default carousel is quite spartan. You can customize it through options
in the ``data-carousel`` attribute. 


.. code-block:: html

   <ul class="pt-carousel" data-carousel="loop: false; control-arrows: true;">
     <li><img title="Panel 1"/></li>
     <li><img title="Panel 2"/></li>
     <li><img title="Panel 3"/></li>
   </ul>


+------------------------+---------+-----------------------------------------+
| Setting                | Default | Description                             |
+========================+=========+=========================================+
| ``auto-play``          | true    | Indicates if the carousel should start  |
|                        |         | playing automatically. If               |
|                        |         | ``control-arrows`` is enabled users     |
|                        |         | will be able to control this manually.  |
+------------------------+---------+-----------------------------------------+
| ``loop``               | true    | Indicates if the carousel will loop.    |
+------------------------+---------+-----------------------------------------+
| ``resize``             | false   | If enabled the carousel will be resized |
|                        |         | to fill its parent.                     |
+------------------------+---------+-----------------------------------------+
| ``expand``             | false   | If enable all panels will be resizes to |
|                        |         | fill the carousel. If not enabled the   |
|                        |         | will dynamically adjust its size to     |
|                        |         | match the currently shown panel.        |
+------------------------+---------+-----------------------------------------+
| ``control-arrows``     | false   | If enabled back and forward-arrows are  |
|                        |         | are created. Note that users can always |
|                        |         | use swipes and keyboard to control the  |
|                        |         | carousel as well.                       |
+------------------------+---------+-----------------------------------------+
| ``control-navigation`` | false   | If enabled a list of links to navigate  |
|                        |         | within the carousel is created.         |
+------------------------+---------+-----------------------------------------+
| ``control-startstop``  | false   | If enabled a button to start and stop   |
|                        |         | carousel animation is added.            |
+------------------------+---------+-----------------------------------------+
| ``time-delay``         | 3000    | The time in milliseconds a single panel |
|                        |         | is shown when animation is active.      |
+------------------------+---------+-----------------------------------------+
| ``time-animation``     | 600     | The duration of a transition animation  |
|                        |         | in milliseconds.                        |
+------------------------+---------+-----------------------------------------+
