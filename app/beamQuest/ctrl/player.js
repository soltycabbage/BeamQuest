var util = require('util'),
    EntityCtrl = require('beamQuest/ctrl/entity');

var Player = function() {
    EntityCtrl.apply(this, arguments);
};
util.inherits(Player, EntityCtrl);

module.exports = Player;