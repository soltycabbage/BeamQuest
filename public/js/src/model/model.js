/**
 * @constructor
 * @extends {cc.Class}
 */
bq.Model = cc.Class.extend({
    ctor: function(json) {
        this.parse(json);
    },

    parse: function(json) {
        // 各モデルでoverrideする
    },

    /**
     * 配列に入ってるjsonをmodelClassで指定されたmodelにparseする
     * @param {Array.<Object> }arr
     * @param {bq.model} modelClass
     * @return {Array.<bq.model>}
     */
    parseArray: function(arr, modelCtor) {
        var result = [];
        _.forEach(arr, function(json) {
            result.push(new modelCtor(json));
        });
        return result;
    }
});

/**
 * @deprecated クラスが大文字でネームスペースが小文字のほうがよさそう
 */
bq.model = bq.Model;
