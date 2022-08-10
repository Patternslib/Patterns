## Description

A pattern that makes dates easier to read.

## Documentation

Example:

     <time class="pat-display-time"
           datetime="2015-01-20T08:00Z"
           data-pat-display-time="from-now: true"
     >
     </time>


### Options reference

| Property          | Default value                               | Description                                                                                                                                                                                                                                                                                                                                                                                     | Type                                         |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `output-format`   |                                             | For non-relative dates (the default, `from-now` set to `false`) show the date in the given format. For formatting options see: https://momentjs.com/docs/#/displaying/format/   | String  |
| `from-now`        | `false`                                     | Change the date to a relative date, relative from now.                                                                                                                           | Boolean |
| `no-suffix`       | `false`                                     | For relative dates and no-suffix is set to `true`, do not show the suffix like `8 years` instead of `8 years ago`.                                                              | Boolean |
| `format`          |                                             | Input parsing format. If not given (the default) the format is set automatically, if possible. For more information, see: https://momentjs.com/docs/#/parsing/string-format/    | String  |
| `locale`          |                                             | The locale to translate the resulting date/time string into. If not given (the default) the locale is retrieved from a `lang` attribute up in the DOM tree or `en`.             | String  |
| `strict`          | `false`                                     | Strict parsing for the input format. See: https://momentjs.com/guides/#/parsing/strict-mode/                                                                                    | Boolean |

