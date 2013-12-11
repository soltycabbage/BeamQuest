var InputHandler = cc.Class.extend({
    downKeys_: [], // 今押されているキーのリスト (max2)
    dx: 0, // プレイヤーx方向移動量(px)
    dy: 0, // プレイヤーy方向移動量(px)
    ctor: function(player) {
        this.player_ = player;
    },

    keyDown: function(key) {
        switch (key) {
            case cc.KEY.a:
                this.addDownKey(key);
                this.dx = this.player_.moveSpeed;
                break;
            case cc.KEY.s:
                this.addDownKey(key);
                this.dy = this.player_.moveSpeed;
                break;
            case cc.KEY.d:
                this.addDownKey(key);
                this.dx = -1 * this.player_.moveSpeed;
                break;
            case cc.KEY.w:
                this.addDownKey(key);
                this.dy = -1 * this.player_.moveSpeed;
                break;
            default:
                break;
        }
    },

    /** @override */
    keyUp: function(key) {
        this.removeDownKey(key);
        if (this.downKeys_.length > 0) {
            return;
        }
        switch (key) {
            case cc.KEY.a:
            case cc.KEY.d:
            case cc.KEY.s:
            case cc.KEY.w:
                this.dx = 0;
                this.dy = 0;
                break;
            default:
                break;
        }
    },

    addDownKey: function(key) {
        if (!_.contains(this.downKeys_, key) && this.downKeys_.length < 2) {
            this.downKeys_.push(key);
        }
    },

    removeDownKey: function(key) {
        this.downKeys_ = _.without(this.downKeys_, key);
    }

});