bq.scene.LoginLayer = cc.Layer.extend({
    status: {
        SUCCESS: 'success', // ログイン成功
        CREATE: 'create',   // サインアップ成功
        ERROR: 'error'        // ログイン失敗
    },
    init: function() {
        this._super();
        this.setKeyboardEnabled(true);
        this.setMouseEnabled(true);
        var platform = cc.Application.getInstance().getTargetPlatform();
        if (platform === cc.TARGET_PLATFORM.MOBILE_BROWSER) {
            this.setTouchEnabled(true);
        }
        this.defaultPlaceHolder_ = '< click here >';
    },

    onEnter: function() {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        var title = bq.Label.createWithShadow('- Beam Quest Online -', 50);
        title.setPosition(cc.p(size.width/2, size.height - 100));
        this.addChild(title);

        var label = bq.Label.create('キャラクター名を入力してください。', 16);
        label.setPosition(cc.p(size.width/2, size.height/2 + 50));
        this.addChild(label);

        var nameField = cc.TextFieldTTF.create(this.defaultPlaceHolder_, 'pixelMplus', 32);
        this.addChild(nameField);
        nameField.setPosition(cc.p(size.width / 2, size.height / 2));
        this.nameField_ = nameField;

        var versionLabel = bq.Label.create(bq.config.version);
        var versionSize = versionLabel.getContentSize();
        versionLabel.setPosition(cc.p(size.width - versionSize.width, versionSize.height));
        this.addChild(versionLabel);
    },

    /**
     * ログイン処理を進める
     * @param {string} userId
     * @private
     */
    processLogin_: function(userId) {
        var soc = bq.Socket.getInstance();
        var hash = sys.localStorage.getItem('userHash:' + userId);
        if (!hash) {
            hash = this.createHash_();
        }

        soc.tryLogin(userId, hash, function(data) {
            if (data.result === this.status.SUCCESS) {
                sys.localStorage.setItem('userHash:' + userId, hash);
                console.log(userId + 'がログインしました。');
                this.welcomeToBeamQuestWorld_(userId, data);
            } else if (data.result === this.status.ERROR) {
                this.loginFailed_(data.message);
            }
        }, this);
    },

    /**
     * フィールド画面へ飛ぶ
     * @param {string} userId
     * @private
     */
    welcomeToBeamQuestWorld_: function(userId, data) {
        // HUD有効
        var hud = bq.Hud.getInstance();
        hud.enable(true);

        this.initPlayer_(userId, data);
        bq.Socket.getInstance().initAfterLogin();
        cc.Director.getInstance().replaceScene(new bq.scene.BeamQuestWorldScene());
    },

    /**
     * 主人公を生成してbq.playerにセットする
     * @param {string} userId
     * @private
     */
    initPlayer_: function(userId, data) {
        // TODO: このクラスでframeCacheにセットするのはハイパー違和感があるので初期設定用のクラスとか作ってやりたい
        // init frame cache
        var frameCache = cc.SpriteFrameCache.getInstance();
        frameCache.addSpriteFrames(s_PlayerWalkingPlist, s_PlayerWalkingImg);
        // FIXME ハイパー違和感2、誰か直して〜
        frameCache.addSpriteFrames(s_SimpleBeamPlist, s_SimpleBeamImg);

        var player = new bq.entity.Player();
        var position = data.player.position;
        player.setPosition(cc.p(position.x, position.y));

        player.setModel(new bq.model.Player(data.player));
        player.setProfile({name: userId});
        player.showName();
        player.initHp();
        bq.player = player;
    },

    /**
     * ログイン失敗した時の処理
     * @param {string} message
     * @private
     */
    loginFailed_: function(message) {
        var failedLabel = bq.Label.create(message);
        var nameP = this.nameField_.getPosition();
        failedLabel.setPosition(nameP.x + 10, nameP.y - 30);
        this.addChild(failedLabel);
        // 数秒後に消えるように
        _.delay(_.bind(function() {
            "use strict";
            this.removeChild(failedLabel);
        }, this), 2000);
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

    /** @override */
    onTouchesEnded: function() {
        var userName = window.prompt('キャラクター名を入力してください', '');
        if (userName) {
            this.processLogin_(userName);
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
            this.nameField_.setPlaceHolder('|');
        } else {
            this.nameField_.detachWithIME();
            this.nameField_.setPlaceHolder(this.defaultPlaceHolder_);
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

bq.scene.LoginScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new bq.scene.LoginLayer();
        layer.init();
        this.addChild(layer);
    }
});
