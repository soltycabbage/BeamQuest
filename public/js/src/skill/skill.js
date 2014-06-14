bq.skill = cc.Class.extend({
    /**
     * @param {!bq.model.Skill} model
     * @param {!bq.model.Entity} user
     * @param {!bq.model.Position} targetPos
     */
    ctor: function(model, user, targetPos) {
        /** @protected */
        this.model = model;

        /** @protected */
        this.user = user;

        /** @protected */
        this.targetPos = targetPos;
    },
    /** @protected */
    fire: function() {

    }
});