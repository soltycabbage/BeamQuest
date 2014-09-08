/// <reference path="../../../typings/tsd.d.ts" />

import UserStore = require('beamQuest/store/userStore');
import PlayerModel = require('beamQuest/model/player');
import PositionModel = require('beamQuest/model/position');
import PlayerCtrl = require('beamQuest/ctrl/player');
import MobCtrl = require('beamQuest/ctrl/mob/mob');
import EntityCtrl = require('beamQuest/ctrl/entity');

declare var EntitiesStore:any;

/**
 * @fileoverview Entityの状態が変化した時などなどを扱う
 */

class Entity {
    private static instance_:Entity;
    public static getInstance():Entity {
        if (Entity.instance_ === undefined) {
            Entity.instance_ = new Entity();
        }
        return Entity.instance_;
    }

    constructor() {
        if (Entity.instance_){
            throw new Error("Error: Instantiation failed: Use Entity.getInstance() instead of new.");
        }
        Entity.instance_ = this;
    }

    private socket_;
    private io_;

    listen(socket, io) {
        this.socket_ = socket;
        this.io_ = io;

        this.socket_.on('user:position:update', (data: any) => this.handlePlayerMove_(data));
        this.socket_.on('user:respawn', (data: any) => this.handleRespawn(data));
        this.socket_.on('user:status:get', (data: any) => this.handleGetStatus_(data));

        EntitiesStore = require('beamQuest/store/entities');
    }

    /**
     * プレイヤーの移動
     * @param {Object} data
     */
    private handlePlayerMove_(data:any) {
        UserStore.getInstance().getSessionData(this.socket_.id, 'mapId', (err, mapId) => {
            data.mapId = mapId;

            // プレイヤーが移動したら位置情報が送られてくる
            EntitiesStore.getInstance().updatePlayerPosition(data);
            // 自分以外の全プレイヤーにブロードキャスト
            this.socket_.broadcast.emit('notify:user:move', data);
        })
    }

    /**
     * mobがPOPするよってクライアントに伝える
     * @param {MobCtrl} mob
     */
    popMob(mob: MobCtrl) {
        if (this.io_) {
            var data = {mob: mob.model.toJSON()};
            this.io_.sockets.emit('notify:entity:mob:pop', data);
        }
    }

    /**
     * mobが動いたよってクライアントに伝える
     * @param {MobCtrl} mob
     */
    moveMob(mob: MobCtrl) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:mob:move', {mob: mob.model.toJSON()});
        }
    }

    /**
     * mobがタゲったよってクライアントに伝える
     * @param {MobCtrl} mob
     * @param {EntityCtrl} entity
     */
    targetTo(mob: MobCtrl, entity:EntityCtrl) {
        var data = {mob: mob.model.toJSON(), target: entity.model.toJSON()};
        this.io_.sockets.emit('notify:entity:mob:targetTo', data);
    }

    /**
     * mobが近接攻撃の構えを取ったよってクライアントに伝える
     * @param {string} mobId
     * @param {PositionModel} srcPos
     * @param {PositionModel} destPos
     * @param {number} range 射程距離(px)
     * @param {number} castTime 発動までの時間(msec)
     */
    startAttackShortRange(mobId: string, srcPos: PositionModel, destPos: PositionModel, range: number, castTime: number) {
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:mob:startAttackShortRange',
                {
                    mobId: mobId,
                    srcPos: srcPos,
                    destPos: destPos,
                    range: range,
                    castTime: castTime
                });
        }
    }

    /**
     * hpの増減をクライアントに伝える
     * @param {Array.<entity: model.Entity, hpAmount: number, isCritical: boolean>} hpAmounts
     */
    updateHp(data){
        if (this.io_) {
            this.io_.sockets.emit('notify:entity:hp:update', {hpDatas: data});
        }
    }

    /**
     * bpの増減をクライアントに伝える
     * @param {Object.<entity: model.Player, bpAmount: number, isCritical: boolean>} data
     */
    updateBp(data) {
        if (this.io_ && data.entity) {
            data.entity.socket.emit('user:status:bp:update', data);
        }
    }

    /**
     * Mob殺すよってクライアントに伝える
     * @param {MobCtrl} mob
     */
    killMob(mob: MobCtrl) {
        var data = {entity: mob.model.toJSON()};
        this.io_.sockets.emit('notify:entity:mob:kill', data);
        _.each(mob.hateList, (hate:any) => {
            this.addExp(hate.entityId, mob);
        });
    }

    /**
     * mobのもつ経験値をplayerに与える
     * @param {string} playerId
     * @param {MobCtrl} mob
     */
    addExp(playerId: string, mob: MobCtrl) {
        var player:any = EntitiesStore.getInstance().getPlayerById(playerId);
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
    }

    /**
     * レベルアップしたよってクライアントに伝える
     * @param {PlayerModel} playerModel
     */
    levelUp(playerModel: PlayerModel) {
        this.io_.sockets.emit('notify:entity:player:levelup', playerModel);
    }

    /**
     * player死んだよってクライアントに伝える
     * @param {PlayerCtrl} player
     */
    killPlayer(player:PlayerCtrl) {
        var data = {entity: player.model.toJSON()};
        this.io_.sockets.emit('notify:entity:player:kill', data);
    }

    /**
     * プレイヤーが復活したよ
     * @param {Object} data
     */
    handleRespawn(data:any) {
        if (data) {
            var playerId = data.id;
            var player:any = EntitiesStore.getInstance().getPlayerById(playerId);
            if (player) {
                player.respawn();
                var d = {entity: player.model.toJSON()};
                this.socket_.broadcast.emit('notify:entity:player:respawn', d);
            }
        }
    }

    /**
     * entityのステータスを返す
     * @param {Object} data
     * @private
     */
    handleGetStatus_(data:any) {
        if (data) {
            var player:any = EntitiesStore.getInstance().getPlayerById(data.entityId);
            if (player) {
                this.socket_.emit('user:status:receive', player.model.toJSON());
            }
        }
    }
}

export = Entity;
