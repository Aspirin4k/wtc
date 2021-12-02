export interface LoggerInterface {
    info: (message: string, val?: object) => void,
    error: (message: string, val?: object) => void,
}
