var InputHandler = cc.Class.extend({
    downKeys_: [], // 今押されているキーのリスト (max2)
    dx: 0, // プレイヤーx方向移動量(px)
    dy: 0, // プレイヤーy方向移動量(px)
    /**
     * コンストラクタ
     * @param {Player} player
     */
    ctor: function(player) {
        this.player_ = player;
        this.chat_ = new Chat();
    },
    /** @override */
    keyDown: function(key) {
        var dir;
        switch (key) {
            // TODO 重複多いのでリファクタリング
            case cc.KEY.enter:
                this.chat_.focusChat();
                break;
            case cc.KEY.a:
                this.addDownKey_(key);
                this.dx = this.player_.moveSpeed;
                dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, Status.walking);
                break;
            case cc.KEY.s:
                this.addDownKey_(key);
                this.dy = this.player_.moveSpeed;
                dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, Status.walking);

                break;
            case cc.KEY.d:
                this.addDownKey_(key);
                this.dx = -1 * this.player_.moveSpeed;
                dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, Status.walking);

                break;
            case cc.KEY.w:
                this.addDownKey_(key);
                this.dy = -1 * this.player_.moveSpeed;
                dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, Status.walking);

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
                // 押しているキーが０でない場合まだ歩いている
                var sts = (this.downKeys_.length == 0) ? Status.stop : null;
                var dir = this.convertDirectionFromKeys_(this.downKeys_);
                this.player_.updateAnimation(dir, sts);
                break;
            case cc.KEY.s:
            case cc.KEY.w:
                this.dy = 0;
                var dir = this.convertDirectionFromKeys_(this.downKeys_);
                var sts = (this.downKeys_.length == 0) ? Status.stop : null;
                this.player_.updateAnimation(dir, sts);
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
     *
     * @param event
     */
    onMouseDown: function(event) {
        // TODO 右クリックと左クリックで動作を変える
        bq.player.shoot(event.getLocation());
    },

    /**
     * @param {Event} key
     * @private
     */
    removeDownKey_: function(key) {
        this.downKeys_ = _.without(this.downKeys_, key);
    },

    /**
     * キー押したやつから方向に変換
     * @param {Array} downs
     * @return {Direction} 見つからない場合null
     */
    convertDirectionFromKeys_: function(downs) {
        var pairs = [
            {key: [cc.KEY.s], val:Direction.bottom},
            {key: [cc.KEY.s,cc.KEY.d], val:Direction.bottomright},
            {key: [cc.KEY.d], val:Direction.right},
            {key: [cc.KEY.d, cc.KEY.w], val:Direction.topright},
            {key: [cc.KEY.w], val:Direction.top},
            {key: [cc.KEY.w, cc.KEY.a], val:Direction.topleft},
            {key: [cc.KEY.a], val:Direction.left},
            {key: [cc.KEY.a, cc.KEY.s], val:Direction.bottomleft}
        ];

        if ( downs.length == 0 ) {
            // 押してない状態はnull (向いてる方向を維持）
            return null;
        }

        var found = _.find(pairs, function(pair) {
            return ( downs.length==1 &&  _.contains(downs, pair.key[0]) )
                || ( downs.length==2 &&   _.contains(downs, pair.key[0]) && _.contains(downs, pair.key[1]) );
        } );


        return found.val;
    }


});
