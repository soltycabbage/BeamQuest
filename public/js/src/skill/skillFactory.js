bq.skill.SkillFactory = cc.Class.extend({
    /**
     * スキルmodelに該当するskillクラスをnewして返す
     * @param {bq.model.Skill} skillModel
     * @param {bq.model.Entity} user
     * @param {bq.model.Position} targetPos
     * @return {bq.skill.Skill}
     */
    create: function(skillModel, user, targetPos) {
        var s = bq.params.Skills;
           var clazz;

           switch(skillModel.id) {
               case s.BURNSTRIKE.id:
                   clazz = bq.skill.BurnStrike;
                   break;
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
