import fetch from "node-fetch"

function startKeepAlivePing(url:any, intervalMs = 10 * 60 * 1000) {
  if (!url) {
    return;
  }

  setInterval(() => {
    fetch(url)
      .then(res => {
        console.log(`[KeepAlive] Pinged ${url} - Status: ${res.status}`);
      })
      .catch(err => {
        console.error(`[KeepAlive] Error pinging ${url}`, err.message);
      });
  }, intervalMs);
}

export { startKeepAlivePing };
