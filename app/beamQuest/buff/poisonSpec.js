var init = require('beamQuest/init'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    EntityCtrl = require('beamQuest/ctrl/entity'),
    EntityModel = require('beamQuest/model/entity'),
    Poison = require('beamQuest/buff/poison');

describe('Test: app/beamQuest/buff/poison', function() {
    var sut, clock, initialHp;
    beforeEach(function() {
        initialHp = 500;
        var model = new EntityModel({name: 'hoge', maxHp: 1000, hp:initialHp});
        var entity = new EntityCtrl();
        entity.setModel(model);
        sut = new Poison(entity);
        clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        // 後処理
    });

    it('10秒経過後にHPが減少している', function() {
        expect(sut.target.model.hp).to.be(initialHp);
        sut.apply();

        // 10秒進める
        clock.tick(10000);

        // HPが減っている
        expect(sut.target.model.hp).to.be.lessThan(initialHp);

    });

    it('デバフ効果時間が切れたらHPが減少しない', function() {
        sut.apply();
        // 十分な時間進める
        clock.tick(sut.time + sut.intervalTime + 100);

        // この時点のHPを保存
        var hp = sut.target.model.hp;

        // さらに時間を進める
        clock.tick(sut.intervalTime + 100);

        // HPが減っていない
        expect(sut.target.model.hp).to.be(hp);
    });

});
