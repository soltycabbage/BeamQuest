var LoginLayer = cc.Layer.extend({
    status: {
        SUCCESS: 'success',
        CREATE: 'create',
        FAIL: 'fail'
    },
    init: function() {
        this._super();
        this.setKeyboardEnabled(true);
        this.setMouseEnabled(true);
    },

    onEnter: function() {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var label = bq.Label.create('キャラクター名を入力してください。', 16);
        label.setPosition(cc.p(size.width/2, size.height/2 + 50));
        this.addChild(label);

        var nameField = cc.TextFieldTTF.create("< click here >", 'pixelMplus', 16);
        this.addChild(nameField);
        nameField.setPosition(cc.p(size.width / 2, size.height / 2));
        this.nameField_ = nameField;
    },

    /**
     * ログイン処理を進める
     * @param {string} userId
     * @private
     */
    processLogin_: function(userId) {
        var soc = Socket.getInstance();
        var hash = sys.localStorage.getItem('userHash:' + userId);
        if (!hash) {
            hash = this.createHash_();
        }

        soc.tryLogin(userId, hash, function(data) {
            if (data.result === this.status.CREATE) {
                sys.localStorage.setItem('userHash:' + userId, hash);
            } else if (data.result === this.status.SUCCESS) {
                console.log(userId + 'がログインしました。');
            } else {
                var failedLabel = bq.Label.create('ログイン失敗。');
                var nameP = this.nameField_.getPosition();
                failedLabel.setPosition(nameP.x + 10, nameP.y - 30);
                this.addChild(failedLabel);
            }
        }, this);
    },

    /**
     * パスワードの代わりにランダムハッシュを使う
     * @return {string}
     * @private
     */
    createHash_: function() {
        var sid = Socket.getInstance().socket.socket.sessionid;
        return CybozuLabs.MD5.calc(sid);
    },

    /** @override */
    onMouseUp: function(evt) {
        var rect = this.getTextInputRect_(this.nameField_);
        var point = evt.getLocation();
        this.enableIME_(cc.rectContainsPoint(rect, point));
    },

    /** @override */
    onKeyUp: function(key) {
       if (key === cc.KEY.enter) {
           this.processLogin_(this.nameField_.getContentText());
       }
    },

    /**
     * テキストフィールドにフォーカスが当たった/外れたらIMEをattach/detachする
     * @param {boolean} isClicked
     * @private
     */
    enableIME_: function(isClicked) {
        if (isClicked) {
            this.nameField_.attachWithIME();
        } else {
            this.nameField_.detachWithIME();
        }
    },

    /**
     * @param {cc.Node} node
     * @return {cc.rect}
     * @private
     */
    getTextInputRect_: function (node) {
        var pos = node.getPosition();
        var cs = node.getContentSize();
        var rc = cc.rect(pos.x, pos.y, cs.width, cs.height);
        rc.x -= rc.width / 2;
        rc.y -= rc.height / 2;
        return rc;
    }
});

var LoginScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new LoginLayer();
        layer.init();
        this.addChild(layer);
    }
});