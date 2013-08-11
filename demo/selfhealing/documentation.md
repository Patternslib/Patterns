# Self-healing

## Description
A pattern for selfhealing content.

## Documentation

The self-healing pattern allows for objects to be removed automatically after a certain amount of time.

On initial page load or when new content is injected it is scanned for elements with the `pat-selfhealing` class.

If not specified otherwise each of the found elements will be removed from the DOM automatically after three seconds.

    <p class="pat-selfhealing">
      This paragraph is going to disappear.
    </p>

The time to heal can be specified with the parameter `delay`.

    <p class="pat-selfhealing" data-pat-selfhealing="delay: 10">
      This paragraph is going to disappear in ten seconds.
    </p>

