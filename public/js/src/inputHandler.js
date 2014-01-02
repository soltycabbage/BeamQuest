bq.InputHandler = cc.Class.extend({
    listeners: [],
    targetEvents_: [
        'onKeyDown',
        'onKeyUp',
        'onMouseDown',
        'onMouseUp',
        'onRightMouseDown',
        'onRightMouseUp'
    ],

    ctor: function() {
        'use strict';
        _.each(this.targetEvents_, this.defineHandler_, this);
    },

    /*
     * イベントハンドラ(delegate)を定義する
     */
    defineHandler_: function(eventName) {
        'use strict';
        this[eventName] = function() {
            var args = arguments;
            // 登録されてるlistenerにイベントを伝える
            _.forEach(this.listeners, function(listener) {
                if (listener[eventName]) {
                    listener[eventName].apply(listener, args);
                }
            });
        }.bind(this);
    },

    /*
     * subjectの入力系イベントを上書きする
     */
    attach: function(subject) {
        'use strict';
        _.each(this.targetEvents_, function(eventName) {
            subject[eventName] = this[eventName];
        }, this);
    },

    /*
     * イベントlistenerを登録する
     */
    addListener: function(listener) {
        'use strict';
        this.listeners.push(listener);
    }

    // NOTE listener削除系のメソッドも必要かしら
});

