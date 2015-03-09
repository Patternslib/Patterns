# Cloning

## Concept

The clone pattern is typically used in case you want to create a form on which it is unknown how many instances the user will need for a certain field or group of fields. For instance if you want to ask the user to fill out the name and birthdate of each family member.

## Usage

Clone is triggered by the class `pat-clone` on a container element that contains the clones. Consider the following markup:


    <h3>
      List of family members
    </h3>
    
    <div class="pat-clone" data-pat-clone="template: #my-template">

      <!-- First visible instance and also template -->

      <fieldset>
        <legend>Family member 1</legend>
        <input name="name-1" type="text" placeholder="Name" />
        <input name="date-1" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset>

      <!-- Clone trigger -->

      <button type="button" class="clone-trigger">Add an extra family member</button>
    </div>

Each time the user clicks on the button saying 'Add an extra family member', the pattern will make a copy the template element. The copy is always created as the next element after the template element in the DOM-tree.

By default the first found element is the element that will be cloned. It's also possible to point the pattern to a specific piece of markup with the property '`template`'. This element will be used as a template for each clone. Typically such an element would be hidden from view. 

The pattern will automatically add up any number in the values of name and value attributes. For instance, if you have `name="item-1"` in your markup, then the first clone will be `name="item-2"` and the one after that `name="item-3"` etc.. If you want to print a number — for instance in a header of each clone — then you can use the syntax: `#{1}`. This string will be replaced by an number that's also increased by 1 for each clone. 

The markup below would have exactly the same effect as the first example, but using a hidden template. This might come in handy when the first instance shown should either contain different information, or if it will have pre-filled values by the server. 

    <h3>
      List of family members
    </h3>
    
    <div class="pat-clone" data-pat-clone="template: #my-template">

      <!-- First visible instance and also template -->

      <fieldset>
        <legend>Family member 1</legend>
        <input name="Mary Johnson" type="text" placeholder="Name" />
        <input name="1977-04-16" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset>

      <!-- Template markup -->

      <fieldset id="my-template" hidden>
        <legend>Family member #{1}</legend>
        <input name="name-1" type="text" placeholder="Name" />
        <input name="date-1" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset> 

      <!-- Clone trigger -->

      <button type="button" class="clone-trigger">Add an extra family member</button>
    </div>

