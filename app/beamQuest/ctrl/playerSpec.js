/**
 * ctrl/playerのユニットテスト。
 * mochaコマンドにより実行する。
 * % NODE_PATH="app:public" mocha --reporter spec このファイルまでのpath
 */

// この3つはどのテストファイルでも必ずrequireすること。
var init = require('beamQuest/init'),
    expect = require('expect.js'),
    sinon = require('sinon');

var PlayerCtrl = require('beamQuest/ctrl/player'),
    PlayerModel = require('beamQuest/model/player'),
    EntityListener = require('beamQuest/listener/entity');

// テスト全体はdescribeで囲む。第一引数はテスト結果のタイトルになる。
describe('test: ctrl/player', function() {
    var sut, model;

    // テストごとに実行させたい前処理
    beforeEach(function() {
        sut = new PlayerCtrl();
        model = new PlayerModel();
        sut.setModel(model);
    });

    // テストごとに実行させたい後処理
    afterEach(function() {
        // ...
    });

    // テストケースはit()で囲む
    it('setModel()したものと同じmodelが参照できる', function() {
        expect(sut.model).to.be(model);
    });

    it('respawnしたらisDeathフラグが下りて全回復する', function() {
        sut.respawn();
        expect(sut.model.isDeath).to.be(false);
        expect(sut.model.hp).to.be(sut.model.maxHp);
    });

    it('経験値が入ったらレベルが上がる', function() {
        // entityListenerのlevelUp()処理はsocket通信が入って邪魔なのでスタブ化する
        // sinon.stub(対象クラス, クラスメソッド, function() { 置き換えたい処理...});
        // 第三引数を省略すると何もしないメソッドに置き換えられる。
        sinon.stub(EntityListener, 'levelUp');
        var firstLevel = sut.model.lv;
        sut.addExp(10000);

        expect(sut.model.lv).to.be.greaterThan(firstLevel);
    });

    // 特定のコンテキストに分けたい時はcontext()で囲む
    context('死亡中は', function() {
        beforeEach(function() {
            sut.model.isDeath = true;
        });

        it('自動回復しない', function() {
            sut.model.addHp(-1);
            sut.model.addBp(-1);
            var firstHp = sut.model.hp;
            var firstBp = sut.model.bp;
            for(var i=0;i<100;i++) {
                sut.update();
            }
            expect(sut.model.hp).to.be(firstHp);
            expect(sut.model.bp).to.be(firstBp);
        });
    });
});