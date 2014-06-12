/**
 * @fileoverview ビムクエ全体で使用するシステムフォント
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
    return cc.LabelTTF.create(msg, bq.Label.DEFAULT_FONT, fontSize);
};

/**
 * ふちどりしたラベルを返す
 * @param {string} msg
 * @param {number=} opt_fontSize
 * @param {cc.color=} opt_color
 * @return {cc.LabelTTF}
 */
bq.Label.createWithShadow = function(msg, opt_fontSize, opt_color) {
    var fontDef = {
        fontName: bq.Label.DEFAULT_FONT,
        fontSize: opt_fontSize || bq.Label.DEFAULT_FONT_SIZE,
        fontAlignmentH: cc.TEXT_ALIGNMENT_CENTER,
        fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
        fontFillColor: opt_color || cc.color(255, 255, 255),
        strokeEnabled: true,
        strokeColor: cc.color(0, 0, 0),
        strokeSize: 2
    };

    return cc.LabelTTF.createWithFontDefinition(msg, fontDef);
};
