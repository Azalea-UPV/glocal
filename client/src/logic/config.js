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

function setPoints(points, callback) {
  fetch(`${env.SERVER_URL}/points`, {
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

function addClass(className, iconURL, callback) {
  fetch(`${env.SERVER_URL}/class`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({'classname': className, 'iconurl': iconURL}),
  })
    .then((response) => response.json())
    .then(callback);
}

function removeClass(classId, callback) {
  fetch(`${env.SERVER_URL}/class`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({'classid': classId}),
  })
    .then((response) => response.json())
    .then(callback);
}

export { getAppInfo, setPoints, getTilesUrl, getUserList, setMod, addClass, removeClass };
