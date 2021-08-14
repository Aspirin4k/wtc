import { createContext } from 'react';

export const APIContext = createContext({
    axios: null,
    fetches: [],
    fetch_results: {},
    save: (url, data) => {},
    saveFetch: () => {}
});
