/**
* ユークリッド距離を計算する
*
* @param a
* @param b
* @returns {number}
*/
function euclidean(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
exports.euclidean = euclidean;

/**
* マンハッタン距離を計算する
*
* @param a
* @param b
* @returns {{x: number, y: number}}
*/
function manhattan(a, b) {
    return { x: b.x - a.x, y: b.y - a.y };
}
exports.manhattan = manhattan;
//# sourceMappingURL=distance.js.map
