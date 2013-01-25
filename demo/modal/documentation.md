# Documentation

Panels, perhaps better (but incorrectly) known as dialogs or popups, can
be created using standard links or buttons using the `pat-modal` class.
An example:

    <a href="/status/server1#content" class="pat-modal">Show server status</a>

This will load the page at `/status/server1`, extract the element with
id `content` and display its content in a panel. If the content consists
of a single element

Forms in panels
---------------

XXX: this is old and 202 might not be the best idea:

"202 - The request has been accepted for processing, but the processing
has not been completed. The request might or might not eventually be
acted upon, as it might be disallowed when processing actually takes
place."

Forms inside panels are automatically handled, but require some support
from the backend server. If a form inside a panel is submitted and the
response from the backend has a HTTP status 202 the result will be shown
inside the panel. If the form action URL has a fragment that will be
used to extract part of the response. If the form action URL has no
fragment the same fragment as used to initially open the panel will be
used. For all other HTTP status codes the panel will be closed and no
further action is taken.