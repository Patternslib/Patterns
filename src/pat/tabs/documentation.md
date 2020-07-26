## Description

The _tabs_ pattern allows you to collect tabs that do not fit in the width of the window, in a drop down menu.

## Documentation

The collapsing tabs pattern is used to to solve the problem where the tabs on certain screen sizes or in certain languages don't all fit in the horizontal space.

![schermafdruk 2015-10-04 19 35 29](https://cloud.githubusercontent.com/assets/738601/10269231/fa382cd8-6ad0-11e5-87cc-39d81637b3cf.png)

![schermafdruk 2015-10-04 19 35 35](https://cloud.githubusercontent.com/assets/738601/10269232/fa3c8f30-6ad0-11e5-8120-607dc0fbdabd.png)

The pattern is applied on markup similar to:

    <nav class="navigation tabs pat-tabs">
        <a href="" class="pat-inject current">General</a>
        <a href="" class="pat-inject">Members</a>
        <a href="" class="pat-inject">Security</a>
        <a href="" class="pat-inject">Advanced</a>
    </nav>

1. The script measures the size of the container element with 'pat-tabs' on it.
2. The script measures the width (including padding and border) of link in the container and adds the sizes up.
3. The tabs that together in width exceed the width of the container are enclosed in a span tag `<span class="extra-tabs">`.

The resulting markup:

    <nav class="navigation tabs pat-tabs">
        <a href="" class="pat-inject current">General</a>
        <a href="" class="pat-inject">Members</a>
        <span class="extra-tabs">
            <a href="" class="pat-inject">Security</a>
            <a href="" class="pat-inject">Advanced</a>
        </span>
    </nav>

CSS will turn this span into a drop down that works on touch and non-touch screens.

The script runs at page load when the dom is ready, it runs again when the browser window is being resized and when a parent layout modifying Pattern — such as pat-switch — is triggered.

### Option reference

This pattern does not have an special configuration properties.
