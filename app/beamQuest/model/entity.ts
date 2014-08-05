import Model    = require('beamQuest/model/model');
import Position = require('beamQuest/model/position');
import Skill    = require('beamQuest/model/skill');
import Skills   = require('beamQuest/params/skills');

/**
 * NPC, PC, mob などの基底クラス
 */
class Entity extends Model {
    hash: string;
    id: number;
    type: any; // @type bq.Types.EntityType
    name: string;
    /** @var さいだいHP */
    maxHp: number;
    /** @var 現在HP */
    hp: number;
    /** @var 攻撃力 */
    attack: number;
    /** @var 防御力 */
    defence: number;
    position: Position;
    /** @var 使用可能スキル一覧 */
    skills: Skill[];

    static DEFAULT_MAX_HP:number = 100;
    static DEFAULT_ATTACK:number = 1;
    static DEFAULT_DEFENCE:number = 1;

    constructor(opt_data) {
        super(opt_data);

        this.hash     = this.data.hash;
        this.id       = this.data.id;
        this.type     = this.data.type;
        this.name     = this.data.name;
        this.maxHp    = this.data.maxHp || Entity.DEFAULT_MAX_HP;
        this.hp       = _.isUndefined(this.data.hp) ? this.maxHp : this.data.hp;
        this.attack   = this.data.attack || Entity.DEFAULT_ATTACK;
        this.defence  = this.data.defence || Entity.DEFAULT_DEFENCE;
        this.position = this.data.position || new Position(null);
        this.skills   = this.data.skills || this.getPresetSkills();
    }

    setId(id: string): void {
        this.id = parseInt(id);
    }

    setPosition(position: Position): void {
        this.position = position;
    }

    /**
     * HP の増減を行う
     * 減らす場合は負の数を指定
     *
     * @param {number} amount
     * @param {boolean=} opt_isCritical クリティカルヒットの場合true
     */
    addHp(amount: number, opt_isCritical: boolean): void {
        this.hp = Math.max(0, Math.min(this.maxHp, this.hp + amount));
        this.emit('addHp', amount, !!opt_isCritical);
    }

    /**
     * レベル1から習得してるスキルを返す
     * @return {Array.<mode.Skill>}
     * @private
     */
    private getPresetSkills(): Skill[] {
        var skills = [];
        skills.push(new Skill(Skills.BURNSTRIKE));
        return skills;
    }

    toJSON(): any {
        var json = super.toJSON();
        json.hash     = this.hash;
        json.id       = this.id;
        json.type     = this.type;
        json.name     = this.name;
        json.maxHp    = this.maxHp;
        json.hp       = this.hp;
        json.attack   = this.attack;
        json.defence  = this.defence;
        json.position = this.position.toJSON();
        json.skills   = this.toArrayJSON(this.skills);
        return json;
    }
}

export = Entity;
