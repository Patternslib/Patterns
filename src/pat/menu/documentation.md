## Description

This is a simple pattern which makes sure that only one menu item ( <li> ) has
the class `open`, with the rest having the class `closed`. This helps designers
can focus on setting the styles for the classes `open`, and `closed`, and
and can rely on the classes being set consistently.

### Examples

####This is a very simple list, in which the <li> elements change color and
####font upon focus.

<ul class="pat-menu">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
  <li>Fourth item</li>
  <li>Fifth item</li>
  <li>Sixth item</li>
</ul>

On loading,
<ul class="pat-menu">
  <li class = 'closed'>First item</li>
  <li class = 'closed'>Second item</li>
  <li class = 'closed'>Third item</li>
  <li class = 'closed'>Fourth item</li>
  <li class = 'closed'>Fifth item</li>
  <li class = 'closed'>Sixth item</li>
</ul>

 If the focus is on the second element,
 <ul class="pat-menu">
   <li class = 'closed'>First item</li>
   <li class = 'open'>Second item</li>
   <li class = 'closed'>Third item</li>
   <li class = 'closed'>Fourth item</li>
   <li class = 'closed'>Fifth item</li>
   <li class = 'closed'>Sixth item</li>
 </ul>
