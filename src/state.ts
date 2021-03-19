import { User } from './auth';

const STATE: { user: User | null } = {
    user: null
};

export function getState() {
    return STATE;
}

export function setUser(user: User | null) {
    STATE.user = user;
}