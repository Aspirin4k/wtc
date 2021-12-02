import config from '../../config/env.json';

export const getConfigValue = (key: string) => {
    const value = process.env[key.toUpperCase()] || config[key.toLowerCase()];
    return typeof value === 'undefined' ? null : value;
}
