## Description

Produce web content while only focussing on the content itself instead of on tags or tools. That's markdown. With the Patterns Markdown pattern you can easily disclose Markdown based content in a prototype or production environment.

## Documentation

The markdown pattern can render [Markdown](http://en.wikipedia.org/wiki/Markdown) in a HTML page. This is done by putting markdown text in an element and adding a pat-markdown class.

    <pre class="pat-markdown">
       This is list of things.

       1. Number one.
       2. Number two.
    </div>

The text inside the element will be rendered using the
[PageDown](http://code.google.com/p/pagedown/) renderer. The original
element will be replaced with a div containing the renderer text:

    <div>
      <p>This is a list of things.</p>
      <ol>
        <li>Number one.</li>
        <li>Number two.</li>
      </ol>
    </div>

### Using markdown with injection

You can also use markdown rendering in combination with injection: if
the injected content is markdown it will automatically be rendered.
There are two ways for Patterns to detect that you are injection
markdown: filename extension and explicit configuration.

If you inject a URL which ends in `.md` it will be assumed to be
markdown source.

    <a href="content.md" class="pat-inject" data-pat-inject="target: #target">Show me the money!</a>

If you have no control over the URL you can also explicitly tell the
injection pattern that it is loading markdown content through its
`data-type` option.

    <a href="content" class="pat-inject" data-pat-inject="target: #target; data-type: markdown">Show me the money!</a>

You can also extract specific sections of your markdown source by specifying a
`source` option which points to a heading in your markdown source. For example
if your markdown looks like this:

    # Top level section

    ## An interesting section

    ## Possibly less interesting

You can include interesting section like this:

    <a href="content.md" class="pat-inject"
       data-pat-inject="source: ## An interesting section; target: #target">Show me the money!</a>
