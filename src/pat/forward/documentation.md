## Description

The _forward_ pattern forwards click events to another element(s).

## Documentation

This pattern can be used to redirect a click on an element to one or more other elements.

    <a href="#" class="pat-forward" data-pat-forward="selector: #submit">Submit form</a>
    <form>
      <submit id="submit">Submit</submit>
    </form>

If the trigger parameter is set to `auto`, the click event will be triggered
immediately after the page is loaded.

    <a href="#" class="pat-forward" data-pat-forward="selector: #submit; trigger: auto">Autosubmit form</a>
    <form>
      <submit id="submit">Submit</submit>
    </form>

### Option reference

| Property   | Description                                               | Default | Allowed Values | Type                                        |
| ---------- | --------------------------------------------------------- | ------- | -------------- | ------------------------------------------- |
| `selector` | The element to which the click event should be forwarded. |         |                | CSS Selector                                |
| `trigger`  | When the forward action should be fired                   | `click` | `click|auto`   | One of the mutually exclusive string values |
