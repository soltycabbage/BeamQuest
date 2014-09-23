/**
 * @class
 * @extends cc.Class
 */
bq.Ping = cc.Class.extend({
    ctor: function(socket, interval) {
        this.socket_ = socket;
        this.interval_ = interval;
        this.roundTripTime_ = 0;
        this.isRunning_ = false;
    },

    start: function() {
        this.isRunning_ = true;
        this.sendPing_();
    },

    stop: function() {
        this.isRunning_ = false;
    },

    isRunning: function() {
        return this.isRunning_;
    },

    getRoundTripTime: function() {
        return this.roundTripTime_;
    },

    sendPing_: function() {
        this.socket_.once('notify:ping', this.onNotifyPing_.bind(this));
        this.socket_.emit('ping:update', {time: this.now_()});
    },

    onNotifyPing_: function(data) {
        this.roundTripTime_ = this.now_() - data.time;
        if (this.isRunning_) {
            setTimeout(this.sendPing_.bind(this), this.interval_);
        }
    },

    now_: function() {
        return new Date().getTime();
    }
});

