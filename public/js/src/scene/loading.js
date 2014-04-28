bq.scene.LoadingLayer = cc.Layer.extend({
    ctor: function(nextScene) {
        this._super();
        this.nextScene_ = nextScene;
    },

    init: function() {
        this._super();
        var winSize = cc.Director.getInstance().getWinSize();
        var worldMap = cc.Sprite.create(s_ImgWorldMap);
        worldMap.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.addChild(worldMap);
    },

    onEnter: function() {
        this._super();
        setTimeout($.proxy(function() {
            cc.Director.getInstance().replaceScene(this.nextScene_);
        }, this), 500);
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