import {getConfigValue} from "./config";

const getStaticURL = (url: string): string => {
    const staticPrefix = getConfigValue('static_prefix');
    return `${staticPrefix}${url}`;
}

export {
    getStaticURL
}