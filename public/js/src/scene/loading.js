bq.scene.LoadingLayer = cc.Layer.extend({
    ctor: function(nextScene) {
        this._super();
        this.nextScene_ = nextScene;
    },

    init: function() {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();
        var worldMap = cc.Sprite.create(s_ImgWorldMap);
        worldMap.setScale(1.5);
        worldMap.setPosition(cc.p(winSize.width/2, winSize.height/2));
        var bgRect = cc.Sprite.create();
        bgRect.setTextureRect(cc.rect(0, 0, winSize.width, winSize.height));
        bgRect.setColor(cc.c3b(50, 121, 205));
        bgRect.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.addChild(bgRect, 0);
        this.addChild(worldMap, 1);
        this.showBar_(true);
    },

    onEnter: function() {
        this._super();
        setTimeout($.proxy(function() {
            this.showBar_(false);
            cc.Director.getInstance().replaceScene(this.nextScene_);
        }, this), 500);
    },

    /**
     * 上下のNow loading...の帯をニュンって表示する
     * @param {boolean} visible
     * @private
     */
    showBar_: function(visible) {
        var topBar = $('#bq-loading-top');
        var bottomBar = $('#bq-loading-bottom');
        if (topBar.length == 0 || bottomBar.length == 0) {
            return;
        }

        if (visible) {
            topBar.animate({top: '0px'});
            bottomBar.animate({bottom: '0px'});
        } else {
            topBar.fadeOut(1000);
            bottomBar.fadeOut(1000);
        }

    }
});

bq.scene.LoadingScene = cc.Scene.extend({
    /**
     * @param {cc.Scene} nextScene loading後に遷移するscene
     */
    ctor: function(nextScene) {
        this._super();
        this.nextScene_ = nextScene;
    },

    onEnter: function() {
        this._super();
        var layer = new bq.scene.LoadingLayer(this.nextScene_);
        layer.init();
        this.addChild(layer);
    }
});

/**
 * ローディング画面を挟んで新しいsceneに遷移する
 * @param {cc.Scene} scene
 */
bq.loadingTo = function(scene) {
    cc.Director.getInstance().replaceScene(new bq.scene.LoadingScene(scene));
};