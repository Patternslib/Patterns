const horizon = new Horizon()
const notifications = horizon('notifications')

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <div id="chatMessages">
        <ul>
          <li v-for="notification in notifications">
            {{ notification.title }}
          </li>
        </ul>
      </div>
      <div id="input">
        <input @keyup.enter="sendNotification" ></input>
      </div>
    </div>
  `,
  data: {
    // Our dynamic list of chat messages
    notifications: []
  },
  created() {
    // Subscribe to messages
    notifications.order('datetime', 'descending').limit(10).watch()
    .subscribe(allNotifications => {
        // Make a copy of the array and reverse it, so newest images push into
        // the messages feed from the bottom of the rendered list. (Otherwise
        // they appear initially at the top and move down)
        this.notifications = [...allNotifications].reverse()
      },
      // When error occurs on server
      error => console.log(error)
    )

    // Triggers when client successfully connects to server
    horizon.onReady().subscribe(
      () => console.log("Connected to Horizon server")
    )

    // Triggers when disconnected from server
    horizon.onDisconnected().subscribe(
      () => console.log("Disconnected from Horizon server")
    )
  },
  methods: {
    sendNotification(event) {
      notifications.store({
        title: event.target.value, // Current value inside <input> tag
        datetime: new Date() // Warning clock skew!
      }).subscribe(
          // Returns id of saved objects
          result => console.log(result),
          // Returns server error message
          error => console.log(error)
        )
        // Clear input for next message
        event.target.value = ''
    }
  }
})
