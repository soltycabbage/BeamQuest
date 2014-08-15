/**
 * ユークリッド距離を計算する
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function euclidean(a:any, b:any): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * マンハッタン距離を計算する
 *
 * @param a
 * @param b
 * @returns {{x: number, y: number}}
 */
export function manhattan(a:any, b:any): any {
    return {x: b.x - a.x, y: b.y - a.y};
}
