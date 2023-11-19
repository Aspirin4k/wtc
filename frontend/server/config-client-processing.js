import {getConfigValue} from "../src/utils/config";

const whitelistFields = [
    'api_url',
    'static_prefix',
    'xsolla_login_project_id',
    'xsolla_login_callback_url',
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
