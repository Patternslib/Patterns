Autofocus
=========

When generating forms it is practical to automatically set the focus on
the first input element. This can be done using an ``autofocus`` class.

.. code-block:: html

   <form>
     <label>Email address
       <input type="text" name="login" class="autofocus" /></label>
     <label>Password
       <input type="password" name="password" /></label>
   </form>

With the above markup the ``login`` input field will automatically get the
focus, so users can start the login process immediately. If multiple
input elements have the ``autofocus`` class the first element without a
value is focused. For example:

.. code-block:: html

   <form>
     <label>Email address
       <input type="text" name="login" class="autofocus" value="john"/></label>
     <label>Password
       <input type="password" name="password" class="autofocus"/></label>
   </form>

in this login form the login field is already filled in so the focus will
be given to the password field instead.

