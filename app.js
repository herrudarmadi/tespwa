document.getElementById("timer").innerText = getTS();

function getTS() {
  return Date.now() / 1000 | 0; 
}

async function registerSync() {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.sync.register("send-attempt");
}

async function registerPeriodicSync() {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.periodicSync.register("send-attempt", {
    // try to update every 1 hours
    // minInterval: 1 * 60 * 60 * 1000,
    
    // try to update every 1 minute
    minInterval: 60 * 1000,
  });
}

// Check if the browser is online or offline
window.addEventListener('offline', () => {
    // Show the offline message
    document.getElementById('offlineMessage').style.display = 'block';
});

window.addEventListener('online', () => {
    // Hide the offline message
    document.getElementById('offlineMessage').style.display = 'none';
});
