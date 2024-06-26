document.getElementById("timer").innerText = getTS();

function getTS() {
  return Date.now() / 1000 | 0; 
}

let isSending, sendingInfoElement = document.getElementById("sendingInfo");

async function registerSync() {
  isSending = true;
  sendingInfoElement.innerText = 'sending attempt..';
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
    // if (isSending) {
    //   registerSync();
    // }
    // Hide the offline message
    document.getElementById('offlineMessage').style.display = 'none';
});

window.addEventListener('load', function() {
    document.getElementById('offlineMessage').style.display = (navigator.onLine ? 'none' : 'block');
});

// Listen for messages from service worker
const channel = new BroadcastChannel('SyncChannel');
channel.addEventListener('message', (event) => {
    if (event.data.type === 'syncCompleted') {
        sendingInfoElement.innerText = 'Attempt sent';
        setTimeout(function() { sendingInfoElement.innerText = ''; }, 1000);
        console.log('Sync completed');
        // Trigger any necessary action in response to sync completion
        isSending = false;
    }
});

const button = document.getElementById("notifications");
button.addEventListener("click", () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      randomNotification();
    }
  });
});

function randomNotification() {
  const notifTitle = "Kumpul tugas!";
  const notifBody = `Jangan lupa kumpul tugas.`;
  const options = {
    body: notifBody
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 5000);
}

