try {
   var autobahn = require('autobahn');
} catch (e) {
   // when running in browser, AutobahnJS will
   // be included without a module system
}

var connection = new autobahn.Connection({
   url: 'ws://push.quaivecloud.com/ws',
   realm: 'quaivecloud'}
);

connection.onopen = function (session) {

   var counter = 0;
   setInterval(function () {
      //console.log("publishing to topic 'push_marker': " + "Hello World "+counter);
      //session.publish('push_marker', [{"title": "Hello World "+ counter, "datetime": new Date().getTime()} ] );
      console.log("publishing to topic 'push_marker': " + "content-updated");
      session.publish('push_marker', [{"title": "content-updated", "datetime": new Date().getTime()} ] );
      document.getElementById('WAMPEvent').innerHTML =  "Event: Hello World "+counter;
      counter += 1;
   }, 2000);
};

connection.open();

var connection2 = new autobahn.Connection({
   url: 'ws://push.quaivecloud.com/ws',
   realm: 'quaivecloud'}
);

function sendDesktopNotification() {
   connection2.onopen = function (session) {

      var notification = document.getElementById('notification').value;
      console.log("sending desktop notification: " + notification);
      session.publish('desktop_notification', [{"title": notification, "datetime": new Date().getTime()} ] );
   
   };

   connection2.open();

}
