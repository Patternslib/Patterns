#Notification

## Description

Notifications are used in applications to notify the user of status changes that happen within the application. Notifications could appear as inline messages, or projected (temporarily) as an overlay not he screen.

## Documentation

A standard notification requires the following markup:

    <p class="pat-notification">
      Hello world!
    </p>

It will render as a message box on the screen, with a small 'x' button with which the user may dismiss the notification.

If you want a Growl/Macos banner style message box that is super imposed on the screen, then consider the following markup:

    <p class="pat-notification" data-pat-notification="type: banner">
      Hello world!
    </p>

It's not necessary to use a `<p>` tag. Also a `<div class="pat-notification">` could be used with rich content inside.

| Property     | Values                            | Type                     | Description                                                                                                                                                               |
| ------------ | --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | `static`, `banner`                | ME                       | Use static (default) for an inline message box. Use banner for super imposed message boxes that can be self healing                                                       |
| `healing`    | 'A value in seconds' `persistent` | ME                       | Enter a value in seconds for when the message should heal itself or choose persistent if only the user can dismiss the message. The default value is `5s` (Five seconds). |
| `class`      | Any valid CSS class name          | String                   | You can assign an extra class to the notification panel. For instance to give it a warning colour in certain situations.                                                  |
| `Store`      | `none`, `session` or `local`      | ME                       | Allows for storing the dismiss status. Upon page reload, a once dismissed notification will not be visible again. (Not relevant for injected notifications)               |
| `close-text` |  Any valid string                 |  String.                 | Specify a custom string for the close button.                                                                                                                             |
| <!--         | 'controls'                        | `icons` `buttons` `none` | List                                                                                                                                                                      | The value `icons` will display iconed controls. Typically styled in the top right corner of the message box. The value `buttons` will append buttons to the message markup. Both values can be used at the same time. When no value is used it defaults to `icons`. When only `buttons` is used, there will be only the appended buttons. | --> |
