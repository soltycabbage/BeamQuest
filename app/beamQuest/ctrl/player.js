var util = require('util'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    userStore = require('beamQuest/store/userStore');

// TODO 外にだして
var config = {
    SAVE_INTERVAL: 300
};

var Player = function() {
    EntityCtrl.apply(this, arguments);
    this.updateCount_ = 0;
};
util.inherits(Player, EntityCtrl);

Player.prototype.update = function() {
    this.updateCount_++;
    if (this.updateCount_ % 300 === 0) {
        userStore.save(this);
    }
};

module.exports = Player;
