# Push Server Support

This is a basic implementation of a Push server based on rethinkdb and horizon.io.
To use this, you need to install both. On mac that is:

> brew install rethinkdb
> sudo npm install -g horizon

https://www.rethinkdb.com
https://horizon-io.surge.sh

There is a configuration in this folder which allows you to start up the dev server for the websocket connection including a rethinkdb instance.

Now start the websocket serever

> hz serve --dev

