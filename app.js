document.getElementById("timer").innerText = getTS();

function getTS() {
  return Date.now() / 1000 | 0; 
}

let isSending;

async function registerSync() {
  isSending = true;
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.sync.register("send-attempt");
}

async function registerPeriodicSync() {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.periodicSync.register("send-attempt", {
    // try to update every half hours
    minInterval: .5 * 60 * 60 * 1000,
    
    // try to update every 1 minute
    // minInterval: 60 * 1000,
  });
}

// Check if the browser is online or offline
window.addEventListener('offline', () => {
    // Show the offline message
    document.getElementById('offlineMessage').style.display = 'block';
});

window.addEventListener('online', () => {
    if (isSending) {
      registerSync();
    }
    // Hide the offline message
    document.getElementById('offlineMessage').style.display = 'none';
});

// Listen for messages from service worker
const channel = new BroadcastChannel('SyncChannel');
channel.addEventListener('message', (event) => {
    if (event.data.type === 'syncCompleted') {
        console.log('Sync completed');
        // Trigger any necessary action in response to sync completion
        isSending = false;
    }
});
