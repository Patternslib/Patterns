[![Build Status](https://secure.travis-ci.org/Patternslib/logging.png?branch=master)](https://travis-ci.org/Patternslib/logging)

Introduction
------------

This is a minimal logging framework for javascript. It implements a subset
of the [log4javascript](http://log4javascript.org/) API, which itself is
inspired by [log4j](http://logging.apache.org/log4j/). Since log4javascript
is huge (180kB) and our needs were small we wrote this 8kB replacement which
still supports configurable log levels and hierarchical loggers.

*logging* can be used both standalone or as an [AMD
module](https://github.com/amdjs/amdjs-api/wiki/AMD).  If you do not use AMD
the logging API is accessible via a global ``logging`` object.

~~~javascript
logging.info("Hello, world!");
});
~~~

If you are using an AMD system such as [RequireJS](http://requirejs.org/)
logging will registered as a module and no globals will be installed. 

~~~javascript
define(["logging"], function(logging) {
    logging.info("Initialisating MyModule");
});
~~~


Configuring through URL
-----------------------

To facilitate debugging you can change the default log level through the URL
query string by adding ``loglevel`` options.

* ``http://www.example.com/?loglevel=DEBUG`` changes the default log level
  to ``DEBUG``.
* ``http://www.example.com/?loglevel-inject=DEBUG`` changes the log level
  for just the inject pattern to ``DEBUG``.
* ``http://www.example.com/?loglevel=ERROR&loglevel-inject=INFO``
  changes the standard log level error, but enables messages at the ``INFO``
  level for the inject pattern.


API reference
-------------


### logging.Level

This is an object which defines all available logging levels: ``DEBUG``,
``INFO``, ``WARN``, ``ERROR`` and ``FATAL``.


### logging.setEnabled(enabled)

* ``enabled`` (boolean): flag indicating if logging should be enabled

This function disables or enables all logging functionality.


### logging.setLevel(level)

* ``level``: new logging level

Use this function to change the logging level. The default level is INFO. To
change the level to DEBUG you can use this:

~~~javascript
logging.setLevel(logging.Level.DEBUG);
~~~

 *Please note that this only changes the root logging level.* You can set a
 different logging for individual lggers as well:

~~~javascript
var log = logging.getLogger("MyModule");
log.setLevel(logging.Level.DEBUG);
~~~

### logging.getLogger(name)

* ``name`` (string): name of the logger

Retrieve, and optionally create, a named logger instance.


The logging object (`log` in the code example) exposes several methods to log
information at various log levels: 

* `debug` is used to log debug messages. There are normally not shown.
* `info` is used to log informational messages. These are normally not shown.
* `warn` is used to log warnings. These are normally shown.
* `error` is used to log errors. There are normally shown.
* `fatal` is used to log fatal errors. There are normally shown.
