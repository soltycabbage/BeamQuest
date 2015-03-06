/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/config/config.d.ts" />

import redis = require('redis');
import config = require('config');

declare var logger: any;

var CONFIG = config.kvs;

/**
 * 拡張可能なようにラップ
 */
export interface Client extends redis.RedisClient {
}

export function createClient(): Client {
    logger.info('kvs type: ' + CONFIG.type);
    if (CONFIG.type !== 'redis') {
        throw new Error('not supported kvs type');
    }
    var client = redis.createClient(CONFIG.port, CONFIG.host);
    client.auth(CONFIG.pass);
    return client;
}
