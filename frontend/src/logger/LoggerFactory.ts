import {LoggerInterface} from "./LoggerInterface";
import {isClient} from "../utils/version";
import {BrowserLogger} from "./BrowserLogger";
import {WinstonLogger} from "./WinstonLogger";

export class LoggerFactory {
    static logger = null;

    private static getNewLogger(): LoggerInterface {
        if (isClient()) {
            return new BrowserLogger();
        } else {
            return new WinstonLogger();
        }
    }

    public static getLogger(): LoggerInterface {
        if (null === this.logger) {
            this.logger = this.getNewLogger();
        }

        return this.logger;
    }
}
