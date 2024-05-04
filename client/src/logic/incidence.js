const env = window.config.env;

function do_like(incidence_id, do_like, callback) {
  fetch(`${env.SERVER_URL}/like`, {
    method: do_like? "POST": "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ do_like: do_like, incidenceid: incidence_id }),
  }).then(callback);
}

function addIncidence(incidence, callback) {
  fetch(`${env.SERVER_URL}/incidence`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incidence),
  }).then(callback);
}

function getIncidences(callback) {
  fetch(`${env.SERVER_URL}/incidence`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(callback);
}

function getIncidence(incidence_id, callback) {
  fetch(
    `${env.SERVER_URL}/incidence?` + new URLSearchParams({ id: incidence_id }),
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then(callback);
}

function addComment(incidenceid, text, callback) {
  fetch(`${env.SERVER_URL}/comment`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ incidenceid: incidenceid, text: text }),
  })
    .then((data) => data.json())
    .then(callback);
}

function closeIncidence(incidenceid, callback) {
  fetch(`${env.SERVER_URL}/incidence`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ incidenceid: incidenceid }),
  }).then(callback);
}

function removeComment(commentid, callback) {
  fetch(`${env.SERVER_URL}/comment`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentid: commentid }),
  }).then(callback);
}

export {
  addIncidence,
  getIncidences,
  getIncidence,
  do_like,
  addComment,
  closeIncidence,
  removeComment,
};
