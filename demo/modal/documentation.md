# Documentation

Panels, perhaps better (but incorrectly) known as dialogs or popups, can
be created using standard links or buttons with the `pat-modal` class.
An example:

    <a href="/status/server1#content" class="pat-modal">Show server status</a>

This will load the page at `/status/server1`, extract the element with
id `content` and display its content in a panel. If the content consists
of a single element XXX