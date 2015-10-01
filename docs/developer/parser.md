# The argument parser's API

Patterns can usually be configured to change their behaviour. This is done
by passing arguments to the parser in data-pat-\* attributes or by using
an internal javascript API. All processing of arguments is done by the
argument parser. Using the parser is easy:

```
var parser = new ArgumentParser("tooltip");
parser.addArgument("delay", 150);
parser.addArgument("loop", false);
parser.addArgument("next-label", "Next");

$("[data-pat-tooltip]").each(function() {
    var options = parser.parse($(this));
    ...
});
```

Lines 1-4 show how to create a new argument parser instance for our
pattern, tell it about the options we want to handle and provide some
default values. The code then finds all elements in the document with a
`data-pat-tooltip` attribute and uses the argument parser to parse the
value.

The parser combines values from multiple sources. In order of priority
they are:

1.  options passed in to the parse() call
2.  options for the `data-pat-<name>` attribute of the parsed element
3.  options for the `data-pat-<name>` attribute of all parent elements
4.  default values provided in the add\_argument() call

## Parser API

### ArgumentParser(name)

   :param string name: name of the pattern

   Create a new argument parser instance. The pattern name is used to find the
   right attribute to parse for elements.


- **ArgumentParser.addArgument(name[, default[, choices[, multiple]]])**

    Parameters:
    - **name** *(String)*: argument name
    - **default**: default value
    - **choices** *(Array)*: list of acceptable values
    - **multiple**: *(Boolean)* flag indicating if argument is a list of values

    Register a new argument. The default value will be used if no value was
    found during parsing, and is used to determine what data type should be
    used.

    As a special feature you can define an *argument-alias* as default value by
    using a ```$<argument name>``` as default value. In that case if no value
    for the argument was provided a copy of the referenced argument will be
    used.

    The default value can also be a function taking a jQuery wrapped element
    and the parameter name as arguments and which returns a default value.

        parser.addArgument("delay", function($el, name) {
            return 500;
        });

- **ArgumentParser.parse($el [, options][, multiple])**

    Parameters:
    - **$el**: *(jQuery object)* for element to parse
    - **options** *(Object)*: default values to use
    - **multiple** *(Boolean)*: flag indicating if multiple values should be returned.

    This method returns the configuration for a pattern from an object. You can
    optionally provide options that will override default values and values
    found on the element.

    If you use argument groups (multiple parameters that share a prefix) their
    options will be returned as a sub-object. For example a parser with
    these arguments:

        parser.addArgument("selector", ".pattern");
        parser.addArgument("control-arrows", false);
        parser.addArgument("control-links", true);
        parser.addArgument("control-index", false);

    will return an object like this:

        {
            selector: ".pattern",
            control: {
                arrows: false,
                links: true,
                index: false
            }
        }
