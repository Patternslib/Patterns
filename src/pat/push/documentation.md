# Description

When an element is equipped with class="pat-push" and a push ID it will listen to, then it will simply refresh the contents of the element.

<a href="/apps/messages/"
   class="pat-push icon-chat"
   data-pat-push="push-id: message_counter; url: /message-counter">
Messages <sup class="counter digit-1">1</sup>
</a>

If you add the `mode: append` option, the fetched content will be appended to the element.
