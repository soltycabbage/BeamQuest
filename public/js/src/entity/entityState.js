/**
 * @fileoverview Entityの状態
 * Created by iwag on 2013/12/31.
 */

bq.EntityState = {

    /**
     * Entityの状況
     */
    Mode: {
        stop: 0, /** 止まってる */
        walking: 1, /** 歩いてる */
        maxMode: 2
    },

    /**
     * 8方向
     * @type {{bottom: number, bottomright: number, right: number, topright: number, top: number, topleft: number, left: number, bottomleft: number, maxDirection: number}}
     */
    Direction: {
        bottom: 0,
        bottomright: 1,
        right: 2,
        topright: 3,
        top: 4,
        topleft: 5,
        left: 6,
        bottomleft: 7,
        maxDirection: 8
    }

};