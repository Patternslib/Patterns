## Description

Modal panels, also known as modal dialogs or popups, can be created using standard links or buttons with the `pat-modal` class.
A modal panel is a panel that requires users to interact with it before they can return to the application behind it.

## Documentation

Case 1: Any ``<div class="pat-modal">`` will be displayed as modal immediately:

    <div class="pat-modal">
        <h2>Modal title</h2>
        <div>Modal content</div>
    </div>


Case 2a: Anchors, forms and subforms would use pat-inject to retrieve remote (or local) contents and display that as modal.
The remote content should return a ``div`` but not contain the ``pat-modal`` class - this is set automatically.

    <a href="/status/server1#content" class="pat-modal">Show server status</a>

This will load the page at `/status/server1`, extract the element with id `content` and display its content in a panel.

Case 2b: Loading a modal form a local ``<template>`` which is within the current page:

    <a href="#modal-source" class="pat-modal">Open modal</a>

    <template id="modal-source">
      <h1>Example modal</h1>
      <p>Hello.</p>
    </template>


For more examples, see the [demo page](./index.html).


### Options reference

You can customise the behaviour of modals through options in the `data-pat-modal` attribute.

| Property               | Default value           | Values                       | Description                                                                                                                                     | Type                                                   |
| ---------------------- | ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `class`                |                         |                              | A class name to be applied to the modal.                                                                                                        | String.                                                |
| `closing`              |  "close-button"         |  ["close-button", "outside"] | Show a "close" button for closing the modal, or let it be closed by clicking outside of the modal area.                                         | One of the mutually exclusive available string values. |
| `close-text`           |  "Close"                |                              | Specify a custom string for the close button.                                                                                                   | String.                                                |
| `panel-header-content` |  `:first:not(.header)`  |  CSS selector or "none"      | Specify a CSS selector which is used for the modal header. If set to "none" no header will be added automatically and you can provide your own. | String.                                                |
| `source`               |                         |  CSS selector                | CSS selector for the injection source. If not given, the URL fragment of the ``href`` attribute from the modal trigger is used.                 | String.                                                |
| `target`               |  `#pat-modal`           |  CSS selector                | CSS selector for the injection target.                                                                                                          | String.                                                |
