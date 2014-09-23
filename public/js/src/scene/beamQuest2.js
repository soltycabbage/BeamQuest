/**
 * @class
 * @extends cc.Layer
 */
bq.scene.BeamQuestWorld2 = cc.Layer.extend({
    ctor:function () {
        'use strict';

        this._super();

        // TODO position.mapIdからロードするマップを取得する
        var tileMap = new cc.TMXTiledMap(bq.config.maps.area.SMALL_MURA);
        tileMap.setPosition(cc.p(0,0));

        var behindMapLayer = tileMap.getLayer('GoBehind');
        if (behindMapLayer) {
            behindMapLayer.setLocalZOrder(bq.config.zOrder.BEHIND_LAYER);
        }
        var mapManager = new bq.MapManager(tileMap);
        bq.mapManager = mapManager;

        var baseLayer = tileMap;
        baseLayer.setPosition(cc.p(0,0));
        baseLayer.addChild(bq.player, bq.config.zOrder.PLAYER);

        this.camera = new bq.Camera(baseLayer);
        this.camera.lookAt(bq.player);
        bq.camera = this.camera;

        var chat = new bq.Chat();
        this.inputHandler = new bq.InputHandler();
        this.inputHandler.attach(this);
        cc.eventManager.addListener(bq.player.inputHandler.getMouseListener(), this);
        cc.eventManager.addListener(bq.player.inputHandler.getKeyboardListener(), this);
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function(key) {
                if (key === cc.KEY.enter) {
                    chat.focusChat();
                }
            }
        }, this);

        // HUD有効
        var hud = bq.Hud.getInstance();
        hud.enable(true);

        bq.space = this.createPhysicalSpace_(tileMap.getContentSize());

        // 当たり判定のコールバック
        // TODO クライアントのコッチ使うようにする（まだサーバサイドできてないのでダメ）
        // bq.space.addCollisionHandler( 1, 2,
        //     bq.EntityManager.getInstance().collisionCallback
        // );

        // add Physics Debug
        this._debugNode = cc.PhysicsDebugNode.create(bq.space);
        this._debugNode.setVisible(false); // 物理の箱見たいときはtrueに
        baseLayer.addChild(this._debugNode);

        // add player physical box
        var shape = new cp.BoxShape(bq.player.getBody(), 32, 32);
        bq.space.addShape(shape);

        this.scheduleUpdate();
        bq.soundManager.playMusic(s_BgmField2, true);
        this.addChild(baseLayer, bq.config.zOrder.BASE_LAYER);
        bq.baseLayer = baseLayer;
        return true;
    },

    /** @override */
    update: function(bt) {
        'use strict';
        bq.space.step(bt);
    },

    createPhysicalSpace_: function(size) {

        var space = new cp.Space();
        var staticBody = space.staticBody;
        // Walls
        var walls = [
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(size.width,0), 0 ),				// bottom
            new cp.SegmentShape( staticBody, cp.v(0,size.height), cp.v(size.width,size.height), 0),	// top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,size.height), 0),				// left
            new cp.SegmentShape( staticBody, cp.v(size.width,0), cp.v(size.width,size.height), 0)	// right
        ];
        _.forEach(walls, function(shape) {
            shape.setElasticity(1);
            shape.setFriction(1);
            space.addStaticShape(shape);
        });

        space.gravity = cp.v(0, 0);

        return space;
    }
});

