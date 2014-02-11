/**
 * マンハッタン距離を計算する
 *
 * @param a
 * @param b
 * @returns {{x: number, y: number}}
 */
module.exports = function(a, b) {
    return {x: b.x - a.x, y: b.y - a.y};
};
