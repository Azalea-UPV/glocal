const env = window.config.env;

function getAppInfo(callback) {
  fetch(`${env.SERVER_URL}/appinfo`, {
    credentials: "include",
    headers: new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    }),
  })
    .then((response) => response.json())
    .then(callback);
}

function saveConfig(points, callback) {
  fetch(`${env.SERVER_URL}/appinfo`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points: points }),
  })
    .then((response) => response.json())
    .then(callback);
}

function getTilesUrl() {
  return env.TILES_URL;
}

function getUserList(callback) {
  fetch(`${env.SERVER_URL}/users`, {
    credentials: "include",
    headers: new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    }),
  })
    .then((response) => response.json())
    .then(callback);
}

function setMod(userid, do_mod, callback) {
  fetch(`${env.SERVER_URL}/mod`, {
    method: do_mod? "POST": "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({'userid': userid}),
  })
    .then((response) => response.json())
    .then(callback);
}

export { getAppInfo, saveConfig, getTilesUrl, getUserList, setMod };
