bq.skill.SkillFactory = cc.Class.extend({
    /**
     * スキルmodelに該当するskillクラスをnewして返す
     * @param {bq.model.Skill} skillModel
     * @param {bq.entity.Entity} user
     * @param {bq.model.Position} targetPos
     * @return {bq.skill.Skill}
     */
    create: function(skillModel, user, targetPos) {
        var s = bq.Types.Skills;
           var clazz;

           switch(skillModel.id) {
               case s.BURNSTRIKE:
                   clazz = bq.skill.BurnStrike;
                   break;
               case s.BIOSHOCK:
                   claszz = bq.skill.BioShock;
               default:
                   return null;
           }

           if (clazz) {
               return new clazz(skillModel, user, targetPos);
           } else {
               return null;
           }
    }
});

bq.skill.SkillFactory.instance_ = new bq.skill.SkillFactory();

bq.skill.SkillFactory.getInstance = function() {
    return bq.skill.SkillFactory.instance_;
};