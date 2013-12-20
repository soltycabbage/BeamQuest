/**
 * @fileoverview ビムクエ全体で使用するシステムフォント
 */

bq.Label = cc.Class.extend({
});

/**
 * @param {string} msg
 * @param {number=} opt_fontSize
 * @return {bq.Label}
 * @static
 */
bq.Label.create = function(msg, opt_fontSize) {
    var fontSize = opt_fontSize || 11;
    return cc.LabelTTF.create(msg, 'pixelMplus', fontSize);
};