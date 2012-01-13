Fancybox
========

If no form handling is required, fancybox offers more eye-candy and
functionality than the modal panels described above. The pattern id is
``fancybox``, used as:

.. code-block:: html

    <a href="/to/load" rel=".fancy!type">Make it fancy!</a>
	
where ``type`` can be any of the types supported by fancybox. More common are:

``ajax``
    Makes an ajax call and displays the resulting content into fancybox. If the
    modified version of fancybox is used, single element injection can be
    specified in the ``href`` atrribute.
	
``iframe``
    The page pointed to by ``href`` is opened in an iframe inside fancybox.
	
``image``
    The image pointed to by ``href`` is opened in fancybox.
	
If no type is specified, the type dimmed most appropriate for the given
``href`` is displayed by fancybox.


Requirements
------------

* `Fancybox <http://fancybox.net/>`_

In order to have selective injection (injection of a single element
from the page), you need the modified version of fancybox that's
currently on SVN.

