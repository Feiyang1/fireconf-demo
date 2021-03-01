const STATE = {
    user: null
};

export function getState() {
    return STATE;
}

export function setUser(user) {
    STATE.user = user;
}