## Description

Modal panels, also known as modal dialogs or popups, can be created using standard links or buttons with the `pat-modal` class.
A modal panel is a panel that requires users to interact with it before they can return to the application behind it.

## Documentation

A basic modal example:

    <a href="/status/server1#content" class="pat-modal">Show server status</a>

This will load the page at `/status/server1`, extract the element with id `content` and display its content in a panel.

### Options reference

You can customise the behaviour of modals through options in the `data-pat-modal` attribute.

| Property     | Default value   | Values                       | Description                                                                                             | Type                                                   |
| ------------ | --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `class`      |                 |                              | A class name to be applied to the modal.                                                                | String.                                                |
| `closing`    |  "close-button" |  ["close-button", "outside"] | Show a "close" button for closing the modal, or let it be closed by clicking outside of the modal area. | One of the mutually exclusive available string values. |
| `close-text` |  "Close"        |                              | Specify a custom string for the close button.                                                           | String.                                                |
