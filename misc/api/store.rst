Storage utility
===============

Patterns include a simple storage utility which you can use to store
data for a pattern. The implementation is similar to the `Web storage
<http://www.whatwg.org/specs/web-apps/current-work/multipage/webstorage.html>`_
mechanism introduces in HTML5 (and in fact uses that as the underlying
storage), but offers multiple named storages and a few extensions that make
it easier to use in patterns.

Store API
-----------

.. js:attribute:: store.supported

   A boolean flag indicating if the browser supports web storage.

.. js:function:: store.local(name)

   :param string name: identifier for the storage section. This should
     almost always be the name of the pattern.
   :returns: storage instance

   Return a local storage instance. Local storage is persistant accross
   multiple browser sessions and tabs, and will survive a browser restart.


.. js:function:: store.session(name)

   :param string name: identifier for the storage section. This should
     almost always be the name of the pattern.
   :returns: storage instance

   Return a session storage instance. Session storage is tied to a single
   browser session. If a browser has multiple tabs open on the same website
   each tab will be seen as a different session. Session storage is not
   guaranteed to survive a browser restart.



Storage instance
----------------

The API for a storage instance mimicks the `HTML5 Storage interface
<http://www.whatwg.org/specs/web-apps/current-work/multipage/webstorage.html#the-storage-interface>`_.
It differs in that it adds a method to remove all data for a pattern, can
return all data as a single javascript object and can store all values that can
be JSON serialized instead of only strings.

.. js:function:: storage.get(name)

   :param string name: name of the stored variable to retrieve
   :returns: stored variable

   Retrieve (a copy of) a stored value from the storage. If no value for the
   given name was stored, `null` will be returned.


.. js:function:: storage.set(name, value)

   :param string name: name of the variable to store
   :param object value: value to store. Can be any type that is JSON serializable.
   :throws QuoteExceededError: This exception is thrown if the browser can
      not store this value.

   Store a variable. This will replace an existing value if already present.


.. js:function:: storage.remove(name)

   :param string name: name of the variable to remove

   Remove a variable from the storage. Unknown names are silently ignored.


.. js:function:: storage.clear()

   This method removes all variables stored for the pattern.


.. js:function:: storage.all()

   :returns: object with all stored data

   This method returns an object containing a copy of all stored data. Please 
   note that this is only a copy: modifications made to the returned object
   will *not* be stored.


Example
-------

.. code-block:: javascript
   :linenos:


   var store = require("../core/store");

   if (store.supported)
       alert("Your browser does not support storage.");
   else {
       var storage = store.local("mypattern");
       storage.set("key", true);
       alert("The stored value is: " + storage.get("key"));
   }
