var util = require('util');

/**
 * ユークリッド距離を計算する
 *
 * @param a
 * @param b
 * @returns {number}
 */
module.exports.euclideanDistance = function(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

/**
 * マンハッタン距離を計算する
 *
 * @param a
 * @param b
 * @returns {{x: number, y: number}}
 */
module.exports.manhattanDistance = function(a, b) {
    return {x: b.x - a.x, y: b.y - a.y};
};