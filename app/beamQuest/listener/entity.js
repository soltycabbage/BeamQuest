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
        this.socket_ = socket;
        this.io_ = io;

        this.socket_.on('user:position:update', this.handlePlayerMove_.bind(this, this.socket_));
        this.socket_.on('user:respawn', this.handleRespawn.bind(this));
        this.socket_.on('user:status:get', this.handleGetStatus_.bind(this, this.socket_));

        EntitiesStore = require('beamQuest/store/entities');
    };

    /**
    * プレイヤーの移動
    * @param {Object} data
    */
    Entity.prototype.handlePlayerMove_ = function (socket, data) {
        UserStore.getInstance().getSessionData(socket.id, 'mapId', function (err, mapId) {
            data.mapId = mapId;

            // プレイヤーが移動したら位置情報が送られてくる
            EntitiesStore.getInstance().updatePlayerPosition(data);

            // 自分以外の全プレイヤーにブロードキャスト
            socket.broadcast.emit('notify:user:move', data);
        });
    };

    /**
    * mobがPOPするよってクライアントに伝える
    * @param {ctrl.Mob} mob
    */
    Entity.prototype.popMob = function (mob) {
        if (this.io_) {
            var data = { mob: mob.model.toJSON() };
            this.io_.sockets.emit('notify:entity:mob:pop', data);
        }
    };

    /**
    * mobが動いたよってクライアントに伝える
    * @param {ctrl.Mob} mob
    */
    Entity.prototype.moveMob = function (mob) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:mob:move', { mob: mob.model.toJSON() });
        }
    };

    /**
    * mobがタゲったよってクライアントに伝える
    * @param {ctrl.Mob} mob
    * @param {ctrl.Entity} entity
    */
    Entity.prototype.targetTo = function (mob, entity) {
        var data = { mob: mob.model.toJSON(), target: entity.model.toJSON() };
        this.io_.sockets.emit('notify:entity:mob:targetTo', data);
    };

    /**
    * mobが近接攻撃の構えを取ったよってクライアントに伝える
    * @param {string} mobId
    * @param {model.Position} srcPos
    * @param {model.Position} destPos
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
    * @param {ctrl.Mob} mob
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
    * @param {ctrl.Mob} mob
    */
    Entity.prototype.addExp = function (playerId, mob) {
        var mapId = mob.model.position.mapId;
        var player = EntitiesStore.getInstance().getPlayerById(mapId, playerId);
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
    * @param {model.Player} playerModel
    */
    Entity.prototype.levelUp = function (playerModel) {
        this.io_.sockets.emit('notify:entity:player:levelup', playerModel);
    };

    /**
    * player死んだよってクライアントに伝える
    * @param player
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
            var mapId = data.position.mapId;
            var playerId = data.id;
            var player = EntitiesStore.getInstance().getPlayerById(mapId, playerId);
            if (player) {
                player.respawn();
                var d = { entity: player.model.toJSON() };
                this.socket_.broadcast.emit('notify:entity:player:respawn', d);
            }
        }
    };

    /**
    * entityのステータスを返す
    * @param {io.socket} socket
    * @param {Object} data
    * @private
    */
    Entity.prototype.handleGetStatus_ = function (socket, data) {
        if (data) {
            var player = EntitiesStore.getInstance().getPlayerById(data.mapId, data.entityId);
            if (player) {
                socket.emit('user:status:receive', player.model.toJSON());
            }
        }
    };
    return Entity;
})();

module.exports = Entity;
//# sourceMappingURL=entity.js.map
