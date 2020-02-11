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

### Option reference

You can customise the behaviour of a gallery through options in the `data-pat-auto-suggest` attribute.

| Property             | Type    | Default Value | Description                                                                                                                                                                                                                                                         |
| -------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ajax-data-type       | String  | "json"        | In what format will AJAX fetched data be returned in?                                                                                                                                                                                                               |
| ajax-search-index    | String  |               | The index or key which must be used to determine the value from the returned data.                                                                                                                                                                                  |
| ajax-url             | URL     |               | The URL which must be called via AJAX to fetch remote data.                                                                                                                                                                                                         |
| allow-new-words      | Boolean | true          | Besides the suggested words, also allow custom user-defined words to be entered.                                                                                                                                                                                    |
| max-selection-size   | Number  | 0             | How many values are allowed? Provide a positive number or 0 for unlimited.                                                                                                                                                                                          |
| placeholder          | String  | Enter text    | The placeholder text for the form input. The `placeholder` attribute of the form element can also be used.                                                                                                                                                          |
| prefill              | List    |               | A list of values with which the form element must be filled in with.                                                                                                                                                                                                |
| prefill-json         | JSON    |               | A JSON object containing prefill values. We support two types of JSON data for prefill data:`{"john-snow": "John Snow", "tywin-lannister": "Tywin Lannister"}` or `[{"id": "john-snow", "text": "John Snow"}, {"id": "tywin-lannister", "text":"Tywin Lannister"}]` |
| words                | List    |               | A list of words which will be used as suggestions if they match with what's being typed by the user.                                                                                                                                                                |
| words-json           | JSON    |               | The suggested words in JSON format.                                                                                                                                                                                                                                 |
| minimum-input-length | Number  | 2             | Defines the minimum amount of characters needed for a search.                                                                                                                                                                                                       |
