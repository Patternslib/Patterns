## Documentation

Auto suggest completes a user's input as he types, providing hints of possible input values in a dropdown list underneath the input field.

This pattern takes three arguments:

- `words`: a list of words which will be automatically suggested when they match what the user types
- `pre-fill`: the default values with which the input must be pre-filled
- `placeholder`: text to be displayed in the input if no values are present

The values inside the input can be cleared by means of a button
of type reset inside the same form as the input.

    <button type="reset">Reset</button>

### Example

    <input type="text" class="pat-autosuggest" data-pat-autosuggest="words: Apple, Pear, Banana; pre-fill: Apple; placeholder: Search by tag…" />
