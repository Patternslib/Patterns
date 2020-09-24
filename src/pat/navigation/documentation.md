## Description

Marks navigation paths with "in-path" and "current" classes and allows of auto-injecting content when menu item was marked with the "current" class.

## Documentation

The "in-path" and "current" classes and the "item-wrapper" are configurable.
Use the "navigation-load-current" class on the navigation wrapper element to content from menu items marked with the "current" class.

For examples see index.html.

### Option reference

The navigation pattern can be configured through a `data-pat-navigation` attribute.
The available options are:

| Field           | Default              | Options        | Description                                                                                                                                                            |
| --------------- | -------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item-wrapper`  | `li`                 | CSS selector   | The DOM element which wraps each menu item. This is used to set the "current" and "in-path" classes also on the wrapper element. If empty, no wrapper element is used. |
| `in-path-class` | `navigation-in-path` | CSS class name | Class name, which is set on item-wrapper elements if nested menu items are within the current path.                                                                    |
| `current-class` | `current`            | CSS class name | Class name, which is set on item-wrapper or items if they are the currently selected menu option.                                                                      |
