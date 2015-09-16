## Description

The syntax highlight pattern is used to add syntax highlighting to code examples in your page.

## Documentation

In technical documentation or certain blog posts, it's common for code snippets
to be included in a page.

This pattern will add automatic syntax highlighting to these snippets of code.

Simply add the `pat-syntax-highlight` class to a DOM element surrounding the code
snippet. Usually you'll want to use the `<pre>` (Preformatted Text) element for
this.

For example:

```
    <pre class="pat-syntax-highlight">
        var pattern = registry.patterns[name];
        if (pattern.transform) {
            try {
                pattern.transform($content);
            } catch (e) {
                if (dont_catch) { throw(e); }
                log.error("Transform error for pattern" + name, e);
            }
        }
    </pre>
```

### HTML Markup

Note that HTML markup inside a `<pre class="pat-syntax-highlight">` element still needs to be escaped.
This means that `<` needs to be escaped to `&lt;` and `>` to `&gt;`. Otherwise the
browser will attempt to render the markup instead of displaying the literal
text.
