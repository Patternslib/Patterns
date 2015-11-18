## Description

The *tabs* pattern allows you to collect tabs that do not fit in the width of the window, in a drop down menu.

## Documentation

TODO

### Examples

    <nav class="navigation tabs pat-tabs">
        <a href="" class="pat-inject current">General</a>
        <a href="" class="pat-inject">Members</a>
        <a href="" class="pat-inject">Security</a>
        <a href="" class="pat-inject">Advanced</a>
    </nav>

    will result in tabs that are too wide to fit in the window to be be placed in 
    an 'extra-tabs' container.
    
    <nav class="navigation tabs pat-tabs">
        <a href="" class="pat-inject current">General</a>
        <a href="" class="pat-inject">Members</a>
        <span class="extra-tabs">
            <a href="" class="pat-inject">Security</a>
            <a href="" class="pat-inject">Advanced</a>
        </span>
    </nav>

### Option reference

Tabs can be configured through a `data-pat-tabs` attribute.
The available options are:

| Field | Default | Options | Description |
| ----- | ------- | ----------- | ----------- |
