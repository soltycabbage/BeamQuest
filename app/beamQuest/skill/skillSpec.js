var init = require('beamQuest/init'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    PlayerSkill = require('beamQuest/skill/playerSkill'),
    SkillModel = require('beamQuest/model/skill'),
    PlayerCtrl = require('beamQuest/ctrl/player'),
    PlayerModel = require('beamQuest/model/player'),
    PositionModel = require('beamQuest/model/position'),
    MobCtrl = require('beamQuest/ctrl/mob/mob'),
    MobModel = require('beamQuest/model/mob');

describe('Test: app/beamQuest/skill/skill', function() {
    var sut, player;
    beforeEach(function() {
        var skillModel = createSkillModel();
        player = createEntity();
        var targetPos = new PositionModel({x: 100, y: 100});
        sut = new PlayerSkill(skillModel, player, targetPos);
    });

    afterEach(function() {
        // 後処理
    });

    it('プレイヤーがスキルを使ったら使用者のBPが減ってない', function() {
        var beforeBp = sut.user.model.bp;
        var expectBp = Math.max(beforeBp - sut.model.bp, 0);
        sut.fire();
        expect(sut.user.model.bp).to.be(expectBp);
    });

    it('スキルの効果範囲内のEntityすべてにダメージとヘイトが入る', function() {
        var mobs = [
            createMob('mob1'),
            createMob('mob2'),
            createMob('mob3'),
            createMob('mob4'),
            createMob('mob5')
        ];
        var damage = 10;
        sinon.stub(sut, 'getMobsByRadius').returns(mobs);
        sut.applyDamage(damage);
        _.forEach(mobs, function(mob) {
            var expectHp = Math.max(mob.model.maxHp - damage, 0);
            expect(mob.model.hp).to.be(expectHp);
            expect(mob.hateList[0].entityId).to.be(player.model.id);
        });
    });

    function createSkillModel() {
        var obj = {
            id: 'skill01',
            name: 'スーパースキル',
            info: 'すごいスキル',
            bp: 10,
            castTime: 1000,
            recastTime: 2000,
            range: 100,
            radius: 50
        };
        return new SkillModel(obj);
    }

    function createEntity() {
        var model = new PlayerModel();
        var ctrl = new PlayerCtrl(model);
        ctrl.model = model;
        return ctrl;
    }

    function createMob(mobId) {
        var model = new MobModel({id: mobId});
        var ctrl = new MobCtrl();
        ctrl.model = model;
        return ctrl;
    }
});
