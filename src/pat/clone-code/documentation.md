## Description

Copy part of the DOM tree and show it as code.


## Documentation

The clone-code copies a part of the DOM tree and wraps it in a `<pre><code>` structure as plain text.

This pattern is especially useful when writing interactive documentation and showing the code at the same time.


### Usage

This pattern is enabled by adding the `pat-clone` class on a container element which contains the original element and any clones of it that may have beeen added.
The first element inside the .pat-clone container is by default assumed to be the original element may be cloned by the user.

    <div class="pat-clone-code">
      <p>Hello.</p>
    </div>

This will result in:

    <pre class="pat-syntax-highlight language-html">
      <code class="language-html hljs">
        <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello.<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
      </code>
    </pre>


### Excluding markup from copying

You can exclude markup from copying by adding the `clone-code` class to it.
If that class is present, the whole `clone-code` markup subtree is ignored.


### Option reference

| Property   | Description                                                                                                                               | Default       | Type                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------- |
| source     | CSS selector to define the source from where the markup should be copied.                                                                 | :first-child  | CSS Selector                      |
| features   | List of features to activate. Currently only `format` is implemented. Format does prettify the HTML markup with the library `prettier`.   | null          | Comma seperated list of strings.  |

