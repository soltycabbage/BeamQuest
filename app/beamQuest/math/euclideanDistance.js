/**
 * ユークリッド距離を計算する
 *
 * @param a
 * @param b
 * @returns {number}
 */
module.exports = function(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};
