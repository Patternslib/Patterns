**This text is formatted in Markdown _with file name extension_**

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices purus vitae erat convallis iaculis.

-   Praesent vulputate blandit
-   Quam non sagittis
-   Nulla feugiat

**Faucibus convallis**

> Vivamus rutrum volutpat sagittis. Etiam eu lorem justo. Vestibulum sit amet placerat est. Nunc iaculis neque ac dui tempus vel vulputate quam laoreet.

Felis dui porttitor eros, ac imperdiet magna orci quis quam. Morbi dapibus lacinia nisl, ac dictum dolor faucibus ac.

| Felis | dui       | porttitor |
| ----- | --------- | --------- |
| dui   | porttitor | eros      |


Some code:

```javascript
const pattern = registry.patterns[name];
if (pattern.transform) {
    try {
        pattern.transform($content);
    } catch (e) {
        if (dont_catch) {
          throw(e);
        }
        log.error("Transform error for pattern" + name, e);
    }
}
```

