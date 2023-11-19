import { getConfigValue } from './config';
import { isClient } from './version';

export interface User {
    email: string,
    name: string,
    picture: string,
    exp: number,
}

let xl;
if (isClient()) {
    const Widget = require('@xsolla/login-sdk').Widget;
    xl = new Widget({
        projectId: getConfigValue("xsolla_login_project_id", "ab7823f3-9232-11ec-8589-42010aa80004"),
        callbackUrl: getConfigValue("xsolla_login_callback_url", "http://127.0.0.1:3001"),
    });
    xl.mount('xl_auth');
}

export const showAuthorizationWidget = () => {
    const container = document.querySelector('#xl_auth');
    (container as HTMLDivElement).style.display = 'block';
  
    xl.open();
}

export const getUserSession = (jwt: string | null): User => {
    if (!jwt) {
        return null;
    }

    const payload = jwt.split('.')[1] || null;
    if (!payload) {
        return null;
    }

    let parsedPayload;
    try {
        parsedPayload = JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }

    return parsedPayload;
}