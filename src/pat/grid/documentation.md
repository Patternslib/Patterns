## Description

The grid patterns allows you create responsive layout, without having to write CSS for it. The Patterns Grid pattern is based on the [Zurb Foundation grid system](http://foundation.zurb.com/grid.php "The Zurb foundation website").

## Documentation

### The grid

**Create powerful multi-device layouts quickly and easily with the 12-column, nestable Foundation grid. If you're familiar with grid systems, you'll feel right at home.**

#### The Basics

The grid is built around two key elements: rows and columns. Rows create a max-width and contain the columns; columns create the actual structure. For layouts to work properly, always put your page content inside a row and a column.

What you need to know is that **columns don't have a fixed width.** They can vary based on the resolution of the screen, or the size of the window (try scaling down this window to see what we mean). Design with that in mind.

#### Nesting Support

The grid allows for nesting down as far as you'd like, though at a certain point it will get absurd. You can use this nesting to create quite complex layouts, as well as some other tricks like form layouts or visual elements.

#### Offsets

Offsets allow you to create additional space between columns in a row. The offsets run from offset-by-one all the way up to offset-by-eleven. Like the rest of the grid, they're nestable.

![image](/src/pat/grid/offsets.png)

#### Centered Columns

Centred columns are placed in the middle of the row. This does not centre their content, but centres the grid element itself. This is a convenient way to make sure a block is centred, even if you change the number of columns it contains. Note: There cannot be any other column blocks in the row for this to work.

#### Source Ordering

Sometimes within the grid you want the order of your markup to not necessarily be the same as the order items are flowed into the grid. Using our source ordering classes, `.push-#/pull-#`, you can shift columns around on desktops and tablets. On phones, the grid will still be linearised into the order of the markup.

![image](/src/pat/grid/source-ordering.png)

The syntax supports push and pull for two to ten columns, and is added directly to the columns themselves.

---

The above text is based on the [Zurb Foundation grid documentation](http://foundation.zurb.com/docs/grid.php)
