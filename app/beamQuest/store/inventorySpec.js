var init = require('beamQuest/init'),
    expect = require('expect.js'),
    sinon = require('sinon');

describe('test store/inventory', function() {
    var sut;

    beforeEach(function() {
        sut = require('beamQuest/store/inventory');
    });

    it('インベントリにpushしたらpickできる', function() {
        var userId = 'testTaro';
        var expectItemId = 'item1';

        sut.push(userId, expectItemId);
        var pickItemId = sut.pick(userId, expectItemId);

        expect(pickItemId).to.be(expectItemId);
    });

    it('他プレイヤーのインベントリからpickしようとしても何も返ってこない', function() {
        var user1 = 'user1';
        var user2 = 'user2';
        var itemId = 'item1';

        // user1のインベントリにアイテムをpush
        sut.push(user1, itemId);

        // user2でpickしようとする
        var pickItemId = sut.pick(user2, itemId);

        // なにも返ってこない
        expect(pickItemId).to.be(null);
    });
});