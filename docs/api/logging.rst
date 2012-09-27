Logging
=======

Patterns uses `log4javascript <http://log4javascript.org/>`_ to provide logging
facilities. To use this you will need to load the logging module and use
its `getLogger` method to get a log utility. This is typically done as part
of the pattern definition. The highlighted lines in the example below show the
changes you will need to make.

.. code-block:: javascript
   :linenos:
   :emphasize-lines: 4,5,6,8

   define([
       'require'
       '../patterns',
       '../logging',
   ], function(require, patterns, logging) {
      var log = logging.getLogger("mypattern");
      ...
      log.info("Hello, world");
      ...
   });

Line 4 tells RequireJS that it needs to load the logging system. The logging
system will be provided as an extra parameter. In line 6 a log utility for
this pattern is requested. Finally in line 8 the log utility is used to log
a message.


The logging object (`log` in the code example) exposes several methods to log
information at various log levels: 

* `debug` is used to log debug messages. There are normally not shown.
* `info` is used to log informational messages. These are normally not shown.
* `warn` is used to log warnings. These are normally shown.
* `error` is used to log errors. There are normally shown.

