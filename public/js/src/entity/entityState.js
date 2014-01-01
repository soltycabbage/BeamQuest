/**
 * @fileoverview Entityの状態
 * Created by iwag on 2013/12/31.
 */

bq.entity.EntityState = {

    /**
     * Entityの状況
     */
    Mode: {
        stop: 'idle', /** 止まってる */
        walking: 'step', /** 歩いてる */
        maxMode: 2
    },

    /**
     * 8方向
     * @type {{bottom: number, bottomright: number, right: number, topright: number, top: number, topleft: number, left: number, bottomleft: number, maxDirection: number}}
     */
    Direction: {
        bottom: 'bottom',
        bottomright: 'bottomright',
        right: 'right',
        topright: 'topright',
        top: 'top',
        topleft: 'topleft',
        left: 'left',
        bottomleft: 'bottomleft',
        maxDirection: 8 // TODO 削除 lengthを使う
    }

};
