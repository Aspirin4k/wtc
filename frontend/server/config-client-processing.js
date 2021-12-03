import {getConfigValue} from "../src/utils/config";

const whitelistFields = [
    'api_url',
    'static_prefix'
];

export const getClientConfig = () => {
    return whitelistFields.reduce(
        (config, field) => {
            config[field] = getConfigValue(field);
            return config
        },
        {}
    )
}
