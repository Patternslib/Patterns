# Auto suggest

## Description
Pattern stacks is a very simple pattern that allows for quickly changing out chunks of content on a page, typically styled as tabs.

## Documentation
Consider the following markup:

    <nav>
        <a href="#sheet-1">Sheet one</a> | <a href="#sheet-2">Sheet two</a> | <a href="#sheet-3">Sheet three</a>
    </nav>
    <article class="pat-stacks">
        <section id="sheet-1">
            <h2>Sheet one</h2>
            <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
        </section>
        <section id="sheet-2">
            <h2>Sheet two</h2>
            <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
            </p>
        </section>
        <section id="sheet-3">
            <h2>Sheet three</h2>
            <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
            </p>
        </section>
    </article>

The class `pat-stacks` initialises the pattern, which will hide all child elements, except the first. 

The pattern will look for anchors on the page that match with any of the IDs of the children of the element that has `pat-stacks` on it. By clicking on any of those anchors, the element with a matching ID becomes visible. 

The anchor of the currently visible sheet automatically receives a class `current`. 

### Option reference

The Stacks pattern may be configured through a `data-pat-stacks` attribute. The available options are:

| Field | Default | Description |
| ----- | ------- | ----------- | 
| `transition` | `show` | Transition effect to use if the action is `show`. Must be one of `none`, `css`, `fade` or `slide`. |
| `effect-duration` | `fast` | Duration of transition. This is ignored if the transition is `none` or `css`. 