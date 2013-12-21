var LoginLayer = cc.Layer.extend({
    status: {
        SUCCESS: 'success', // ログイン成功
        CREATE: 'create',   // サインアップ成功
        FAIL: 'fail'        // ログイン失敗
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
        if (!this.isValidUserId_(userId)) {
            return;
        }
        var soc = bq.Socket.getInstance();
        var hash = sys.localStorage.getItem('userHash:' + userId);
        if (!hash) {
            hash = this.createHash_();
        }

        soc.tryLogin(userId, hash, function(data) {
            if (data.result === this.status.CREATE) {
                sys.localStorage.setItem('userHash:' + userId, hash);
                this.welcomeToBeamQuestWorld_(userId);
            } else if (data.result === this.status.SUCCESS) {
                console.log(userId + 'がログインしました。');
                this.welcomeToBeamQuestWorld_(userId);
            } else {
                var failedLabel = bq.Label.create('ログイン失敗。');
                var nameP = this.nameField_.getPosition();
                failedLabel.setPosition(nameP.x + 10, nameP.y - 30);
                this.addChild(failedLabel);
            }
        }, this);
    },

    /**
     * フィールド画面へ飛ぶ
     * @param {string} userId
     * @private
     */
    welcomeToBeamQuestWorld_: function(userId) {
        this.initPlayer_(userId);
        cc.Director.getInstance().replaceScene(new BeamQuestWorldScene());
    },

    /**
     * 主人公を生成してbq.playerにセットする
     * @param {string} userId
     * @private
     */
    initPlayer_: function(userId) {
        // TODO: このクラスでframeCacheにセットするのはハイパー違和感があるので初期設定用のクラスとか作ってやりたい
        // init frame cache
        var frameCache = cc.SpriteFrameCache.getInstance();
        frameCache.addSpriteFrames(s_PlayerWalkingPlist, s_PlayerWalkingImg);

        var player = new Player();
        // TODO: ログイン成功時にユーザ情報を返してもらうか、ここでuserIdをサーバに投げてユーザ情報を取るAPIを叩くとかすると良さそう
        player.name = userId;
        bq.player = player;
    },

    /**
     * 入力されたUserIDが正しいか判定する
     * @param {string} userId
     * @return {boolean}
     * @private
     */
    isValidUserId_: function(userId) {
        var valid = true;
        // TODO: 条件増やす
        valid = (userId.length > 0);
        return valid;
    },

    /**
     * パスワードの代わりにランダムハッシュを使う
     * @return {string}
     * @private
     */
    createHash_: function() {
        var sid = bq.Socket.getInstance().socket.socket.sessionid;
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