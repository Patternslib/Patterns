const horizon = new Horizon()
const push_markers = horizon('push_marker')

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <div id="pushMarkers">
        <ul>
          <li v-for="push_marker in push_markers">
            {{ push_marker.title }}
          </li>
        </ul>
      </div>
      <div id="input">
        <input @keyup.enter="sendPushMarker" ></input>
      </div>
    </div>
  `,
  data: {
    // Our dynamic list of pushMarkers
    push_markers: []
  },
  created() {
    // Subscribe to push_markers
    push_markers.order('datetime', 'descending').limit(10).watch()
    .subscribe(allPushMarkers => {
        // Make a copy of the array and reverse it, so newest images push into
        // the messages feed from the bottom of the rendered list. (Otherwise
        // they appear initially at the top and move down)
        this.push_markers = [...allPushMarkers].reverse()
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
    sendPushMarker(event) {
      push_markers.store({
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
