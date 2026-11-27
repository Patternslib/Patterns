Hi Daniël,

we had the need to validate if at least one checkbox in a group of checkboxes was checked.
This was not yet supported by pat-validation nor by the HTML specficiation.

As a side note - required radio buttons are supported. A `required` attribute on one or all radio inputs in a group of radio inputs is supported by the HTML specification and validated by pat-validation.

We were in need to quickly support that in one of our projects and I did a implementation to support that.

Please see this implementation as a draft to discuss about.

These parameters were added:

-   min-values: The minimum number of values to be checked, selected of filled-out.
