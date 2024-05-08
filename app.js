document.getElementById("timer").innerText = getTS();

function getTS() {
  return Date.now() / 1000 | 0; 
}

async function registerSync() {
  const swRegistration = await navigator.serviceWorker.ready;
  swRegistration.sync.register("send-timer");
}
