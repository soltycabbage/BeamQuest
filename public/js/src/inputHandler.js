var InputHandler = cc.Class.extend({
    downKeys_: [], // 今押されているキーのリスト (max2)
    dx: 0, // プレイヤーx方向移動量(px)
    dy: 0, // プレイヤーy方向移動量(px)
    ctor: function(player) {
        this.player_ = player;
    },

    /** @override */
    keyDown: function(key) {
        switch (key) {
            case cc.KEY.a:
                this.addDownKey_(key);
                this.dx = this.player_.moveSpeed;
                break;
            case cc.KEY.s:
                this.addDownKey_(key);
                this.dy = this.player_.moveSpeed;
                break;
            case cc.KEY.d:
                this.addDownKey_(key);
                this.dx = -1 * this.player_.moveSpeed;
                break;
            case cc.KEY.w:
                this.addDownKey_(key);
                this.dy = -1 * this.player_.moveSpeed;
                break;
            default:
                break;
        }
    },

    /** @override */
    keyUp: function(key) {
        this.removeDownKey_(key);
        if (this.downKeys_.length > 0) {
            // return;
            // TODO: 移動で引っかかるのをどうにかする
        }
        switch (key) {
            case cc.KEY.a:
            case cc.KEY.d:
                this.dx = 0;
                break;
            case cc.KEY.s:
            case cc.KEY.w:
                this.dy = 0;
                break;
            default:
                break;
        }
    },

    /**
     * 同時押し時に滑らかに移動させたいので現在押されているキーをリストに登録して管理する
     * @param {Event} key
     * @private
     */
    addDownKey_: function(key) {
        if (!_.contains(this.downKeys_, key) && this.downKeys_.length < 2) {
            this.downKeys_.push(key);
        }
    },

    /**
     * @param {Event} key
     * @private
     */
    removeDownKey_: function(key) {
        this.downKeys_ = _.without(this.downKeys_, key);
    }

});