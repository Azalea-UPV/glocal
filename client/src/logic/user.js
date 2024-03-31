const env = window.config.env;

function login(email, password, callback) {
    fetch(`${env.SERVER_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({mail: email, password: password})
    }).then(response => {
        if (callback) {
            callback(response.status == 200)
        }
    });
}

function signUp(email, user, password, callback) {
    fetch(`${env.SERVER_URL}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({mail: email, user: user, password: password})
    }).then(response => {
        if (callback) {
            callback(response.status == 200)
        }
    });
}

function logout(callback) {
    fetch(`${env.SERVER_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true
        },
    }).then(response => {
        if (callback) {
            callback(response.status == 200)
        }
    });
}

export { login, logout, signUp };