///<reference path='../node/node.d.ts' />

declare var levels: string;

declare module "log4js" {
    export function getLogger(categoryName: string): Logger;
    export function connectLogger(logger4js: any, options: any): any;

    interface Logger {
        setLevel(string): void;


    }


    export module levels {
        var ALL:   Level;
        var TRACE: Level;
        var DEBUG: Level;
        var INFO:  Level;
        var WARN:  Level;
        var ERROR: Level;
        var FATAL: Level;
        var OFF:   Level;

        function toLevel(sArg: string, defaultLevel: Level): Level;
    }

    interface Level {
        level: Number;
        levelStr: string;
    }
}
