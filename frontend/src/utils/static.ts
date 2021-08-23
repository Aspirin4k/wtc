let staticPrefix: string;
if (typeof window !== "undefined") {
    // @ts-ignore
    staticPrefix = (window.cache && window.cache.static && window.cache.static.prefix) || '';
}

const initStaticPrefix = (prefix: string): void => {
    staticPrefix = prefix;
}

const getStaticURL = (url: string): string => {
    return `${staticPrefix}${url}`;
}

export {
    initStaticPrefix,
    getStaticURL
}