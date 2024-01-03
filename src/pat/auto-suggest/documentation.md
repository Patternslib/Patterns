## Description

The auto-suggest pattern completes a user's input as he types, providing hints of possible input values in a dropdown list underneath the input field.

## Documentation

This pattern is useful for creating a tagging widget or a search widget which provides suggested search terms.

The values inside the input can be cleared by means of a button of type reset inside the same form as the input.

    <button type="reset">Reset</button>

### Examples

    <input type="text" class="pat-auto-suggest" data-pat-auto-suggest="words: Apple, Pear, Banana; pre-fill: Apple; placeholder: Search by tag…" />

Restricting the input to only one selected value:

        <input class="pat-auto-suggest" placeholder="Pick a car"
                data-pat-auto-suggest="words: Toyota, Volkswagen, Honda, Chevrolet, BMW, Mercedes, Volvo, Citröen, Audi;
                                    allow-new-words: false; max-selection-size: 1" type="text"></input>

Pre-fill the input element with a list of words:

        <input class="pat-auto-suggest" placeholder="Pick a car"
            data-pat-auto-suggest="pre-fill: Toyota;
                                    words: Toyota, Volkswagen, Honda, Chevrolet, BMW, Mercedes, Volvo, Citröen, Audi;
                                    allow-new-words: false;" type="text"></input>

Pre-fill the input element with words in JSON format and don't allow the user to enter their own words.

        <input class="pat-auto-suggest" placeholder="Pick a character"
               data-pat-auto-suggest='words-json: [{"id": "john-snow", "text": "John Snow"}, {"id": "tywin-lannister", "text":"Tywin Lannister"}];
                                     prefill-json: {"john-snow":"John Snow"};
                                     allow-new-words: false;' type="text"></input>

### Batching support

This pattern can load data in batches via AJAX.
The following example demonstrates how to define batch sizes for the initial load (`max-initial-size`) and for subsequent loads (`ajax-batch-size`).
If the `ajax-batch-size` is not defined or set to `0` (this is the default), batching is disabled.
You can still define the `max-initial-size` to limit the number of items to be displayed on the first page.

    <input
        type="text"
        class="pat-auto-suggest"
        data-pat-auto-suggest="
                ajax-url: /path/to/data.json;
                ajax-batch-size: 10;
                max-initial-size: 20;
        "
    />

---

**Note**

The server needs to support batching, otherwise these options do not have any effect.

---

### AJAX parameters submitted to the server

| Parameter  | Description                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| index      | The optional search index to be used on the server, if needed.                                                                                 |
| q          | The search term.                                                                                                                               |
| page_limit | The number of items to be returned per page. Based on the current page it is wether `max-initial-size` (page 1) or `ajax-batch-size` (page 2). |
| page       | The current page number.                                                                                                                       |

### Option reference

You can customise the behaviour of a gallery through options in the `data-pat-auto-suggest` attribute.

| Property             | Type    | Default Value | Description                                                                                                                                                                                                                                                                          |
| -------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ajax-batch-size      | Number  | 0             | Batch size for subsequent pages of a bigger result set. `0` (the default) to disable batching. For the first page, `max-initial-size` is used.                                                                                                                                       |
| ajax-data-type       | String  | "json"        | In what format will AJAX fetched data be returned in?                                                                                                                                                                                                                                |
| ajax-search-index    | String  |               | The index or key which must be used to determine the value from the returned data.                                                                                                                                                                                                   |
| ajax-timeout         | Number  | 400           | Timeout before new ajax requests are sent. The default value is set to `400` milliseconds and prevents querying the server too often while typing.                                                                                                                                   |
| ajax-url             | URL     |               | The URL which must be called via AJAX to fetch remote data.                                                                                                                                                                                                                          |
| allow-new-words      | Boolean | true          | Besides the suggested words, also allow custom user-defined words to be entered.                                                                                                                                                                                                     |
| max-initial-size     | Number  | 10            | Initial batch size. Display `max-initial-size` items on the first page of a bigger result set.                                                                                                                                                                                       |
| max-selection-size   | Number  | 0             | How many values are allowed to be selected? Provide a positive number or 0 for unlimited.                                                                                                                                                                                            |
| placeholder          | String  | Enter text    | The placeholder text for the form input. The `placeholder` attribute of the form element can also be used.                                                                                                                                                                           |
| prefill              | List    |               | A comma separated list of values with which the form element must be filled in with. The `value-separator` option does not have an effect here.                                                                                                                                      |
| prefill-json         | JSON    |               | A JSON object containing prefill values. We support two types of JSON data for prefill data:`{"john-snow": "John Snow", "tywin-lannister": "Tywin Lannister"}` or `[{"id": "john-snow", "text": "John Snow"}, {"id": "tywin-lannister", "text":"Tywin Lannister"}]`                  |
| value-separator      | String  | ","           | A separator character to separate multiple values from each other. This is used to initialize and write back the selection to the input field. The `prefill` option is always separated by a comma. If you want to use a semicolon as separator do it like so: `value-separator: ;;` |
| words                | List    |               | A list of words which will be used as suggestions if they match with what's being typed by the user.                                                                                                                                                                                 |
| words-json           | JSON    |               | The suggested words in JSON format.                                                                                                                                                                                                                                                  |
| minimum-input-length | Number  | 2             | Defines the minimum amount of characters needed for a search.                                                                                                                                                                                                                        |
