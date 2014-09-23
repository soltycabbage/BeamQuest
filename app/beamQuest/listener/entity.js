/// <reference path="../../../typings/tsd.d.ts" />
var UserStore = require('beamQuest/store/userStore');

/**
* @fileoverview Entityの状態が変化した時などなどを扱う
*/
var Entity = (function () {
    function Entity() {
        if (Entity.instance_) {
            throw new Error("Error: Instantiation failed: Use Entity.getInstance() instead of new.");
        }
        Entity.instance_ = this;
    }
    Entity.getInstance = function () {
        if (Entity.instance_ === undefined) {
            Entity.instance_ = new Entity();
        }
        return Entity.instance_;
    };

    Entity.prototype.listen = function (socket, io) {
        var _this = this;
        this.socket_ = socket;
        this.io_ = io;

        this.socket_.on('user:position:update', function (data) {
            return _this.handlePlayerMove_(data);
        });
        this.socket_.on('user:respawn', function (data) {
            return _this.handleRespawn(data);
        });
        this.socket_.on('user:status:get', function (data) {
            return _this.handleGetStatus_(data);
        });

        EntitiesStore = require('beamQuest/store/entities');
    };

    /**
    * プレイヤーの移動
    * @param {Object} data
    */
    Entity.prototype.handlePlayerMove_ = function (data) {
        var _this = this;
        UserStore.getInstance().getSessionData(this.socket_.id, 'mapId', function (err, mapId) {
            data.mapId = mapId;

            // プレイヤーが移動したら位置情報が送られてくる
            EntitiesStore.getInstance().updatePlayerPosition(data);

            // 自分以外の全プレイヤーにブロードキャスト
            _this.socket_.broadcast.emit('notify:user:move', data);
        });
    };

    /**
    * mobがPOPするよってクライアントに伝える
    * @param {MobCtrl} mob
    */
    Entity.prototype.popMob = function (mob) {
        if (this.io_) {
            var data = { mob: mob.model.toJSON() };
            this.io_.sockets.emit('notify:entity:mob:pop', data);
        }
    };

    /**
    * mobが動いたよってクライアントに伝える
    * @param {MobCtrl} mob
    */
    Entity.prototype.moveMob = function (mob) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:mob:move', { mob: mob.model.toJSON() });
        }
    };

    /**
    * mobがタゲったよってクライアントに伝える
    * @param {MobCtrl} mob
    * @param {EntityCtrl} entity
    */
    Entity.prototype.targetTo = function (mob, entity) {
        var data = { mob: mob.model.toJSON(), target: entity.model.toJSON() };
        this.io_.sockets.emit('notify:entity:mob:targetTo', data);
    };

    /**
    * mobが近接攻撃の構えを取ったよってクライアントに伝える
    * @param {string} mobId
    * @param {PositionModel} srcPos
    * @param {PositionModel} destPos
    * @param {number} range 射程距離(px)
    * @param {number} castTime 発動までの時間(msec)
    */
    Entity.prototype.startAttackShortRange = function (mobId, srcPos, destPos, range, castTime) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:mob:startAttackShortRange', {
                mobId: mobId,
                srcPos: srcPos,
                destPos: destPos,
                range: range,
                castTime: castTime
            });
        }
    };

    /**
    * hpの増減をクライアントに伝える
    * @param {Array.<entity: model.Entity, hpAmount: number, isCritical: boolean>} hpAmounts
    */
    Entity.prototype.updateHp = function (data) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:hp:update', { hpDatas: data });
        }
    };

    /**
    * bpの増減をクライアントに伝える
    * @param {Object.<entity: model.Player, bpAmount: number, isCritical: boolean>} data
    */
    Entity.prototype.updateBp = function (data) {
        if (this.io_ && data.entity) {
            data.entity.socket.emit('user:status:bp:update', data);
        }
    };

    /**
    * Mob殺すよってクライアントに伝える
    * @param {MobCtrl} mob
    */
    Entity.prototype.killMob = function (mob) {
        var _this = this;
        var data = { entity: mob.model.toJSON() };
        this.io_.sockets.emit('notify:entity:mob:kill', data);
        _.each(mob.hateList, function (hate) {
            _this.addExp(hate.entityId, mob);
        });
    };

    /**
    * mobのもつ経験値をplayerに与える
    * @param {string} playerId
    * @param {MobCtrl} mob
    */
    Entity.prototype.addExp = function (playerId, mob) {
        var player = EntitiesStore.getInstance().getPlayerById(playerId);
        if (player) {
            player.addExp(mob.model.exp);
            player.model.socket.emit('user:status:exp:update', {
                exp: mob.model.exp,
                prevLvExp: player.model.prevLvExp,
                currentExp: player.model.exp,
                nextLvExp: player.model.nextLvExp,
                mobName: mob.model.name
            });
        }
    };

    /**
    * レベルアップしたよってクライアントに伝える
    * @param {PlayerModel} playerModel
    */
    Entity.prototype.levelUp = function (playerModel) {
        this.io_.sockets.emit('notify:entity:player:levelup', playerModel);
    };

    /**
    * player死んだよってクライアントに伝える
    * @param {PlayerCtrl} player
    */
    Entity.prototype.killPlayer = function (player) {
        var data = { entity: player.model.toJSON() };
        this.io_.sockets.emit('notify:entity:player:kill', data);
    };

    /**
    * プレイヤーが復活したよ
    * @param {Object} data
    */
    Entity.prototype.handleRespawn = function (data) {
        if (data) {
            var playerId = data.id;
            var player = EntitiesStore.getInstance().getPlayerById(playerId);
            if (player) {
                player.respawn();
                var d = { entity: player.model.toJSON() };
                this.socket_.broadcast.emit('notify:entity:player:respawn', d);
            }
        }
    };

    /**
    * entityのステータスを返す
    * @param {Object} data
    * @private
    */
    Entity.prototype.handleGetStatus_ = function (data) {
        if (data) {
            var player = EntitiesStore.getInstance().getPlayerById(data.entityId);
            if (player) {
                this.socket_.emit('user:status:receive', player.model.toJSON());
            }
        }
    };
    return Entity;
})();

module.exports = Entity;
//# sourceMappingURL=entity.js.map
