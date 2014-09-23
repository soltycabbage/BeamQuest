/**
 * @fileoverview ビムクエ全体で使用するシステムフォント
 */

/**
 * @class
 * @extends cc.Class
 */
bq.Label = cc.Class.extend({
});

bq.Label.DEFAULT_FONT = 'systemFont';
bq.Label.DEFAULT_FONT_SIZE = 11;

/**
 * @param {string} msg
 * @param {number=} opt_fontSize
 * @return {cc.LabelTTF}
 * @static
 */
bq.Label.create = function(msg, opt_fontSize) {
    var fontSize = opt_fontSize || bq.Label.DEFAULT_FONT_SIZE;
    return new cc.LabelTTF(msg, bq.Label.DEFAULT_FONT, fontSize);
};

/**
 * ふちどりしたラベルを返す
 * @param {string} msg
 * @param {number=} opt_fontSize
 * @param {cc.color=} opt_color
 * @return {cc.LabelTTF}
 */
bq.Label.createWithShadow = function(msg, opt_fontSize, opt_color) {
    var fontDef = new cc.FontDefinition();
    var defs = {
        fontName: bq.Label.DEFAULT_FONT,
        fontSize: opt_fontSize || bq.Label.DEFAULT_FONT_SIZE,
        fontAlignmentH: cc.TEXT_ALIGNMENT_CENTER,
        fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
        fillStyle: opt_color || cc.color(255, 255, 255),
        strokeEnabled: true,
        strokeStyle: cc.color(0, 0, 0),
        lineWidth: 2
    };
    fontDef = _.extend(fontDef, defs);
    var font = new cc.LabelTTF(msg);
    font.setTextDefinition(fontDef);
    return font;
};
