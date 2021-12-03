import config from '../../config/env.json';
import {isClient} from "./version";

export const getConfigValue = (key: string, defaultValue: any = null) => {
    const value = (
            isClient()
                // @ts-ignore
                ? window.config && window.config[key.toLowerCase()]
                : process.env[key.toUpperCase()]
        ) || config[key.toLowerCase()];
    return typeof value === 'undefined' ? defaultValue : value;
}
