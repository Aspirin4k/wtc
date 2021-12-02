import {LoggerInterface} from "./LoggerInterface";

export class BrowserLogger implements LoggerInterface {
    public error(message: string, val: object = {}): void {
        console.log({
            context: val,
            message,
            date: (new Date()).toISOString()
        });
    }

    public info(message: string, val: object = {}): void {
        console.log({
            context: val,
            message,
            date: (new Date()).toISOString()
        });
    }
}
