/// <reference path="../../../typings/tsd.d.ts" />

import redis = require('redis');
import config = require('config');

declare var logger: any;

var CONFIG = config.kvs;

export function createClient(): any {
    logger.info('kvs type: ' + CONFIG.type);
    if (CONFIG.type !== 'redis') {
        throw new Error('not supported kvs type');
    }
    var client = redis.createClient(CONFIG.port, CONFIG.host);
    client.auth(CONFIG.pass);
    return client;
}
