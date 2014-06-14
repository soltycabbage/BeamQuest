(function () {
    var d = document;
    var c = {
        COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        chipmunk:true,
        showFPS:true,
        frameRate:30,
        loadExtension:false,
        renderMode:0,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'js/lib/cocos2d/cocos2d/',
        //SingleEngineFile:'',
        appFiles:[
            // サーバ側からも参照されるやつら
            'shared/js/gameTypes.js',

            // libs
            'js/lib/jquery-min.js',
            'js/lib/underscore-min.js',
            'js/lib/md5.js',
            'js/lib/gamecontroller.min.js',
            'js/lib/jquery.mouseinfobox.js',
            'js/lib/jquery-ui.min.js',
            'js/lib/ejs.js',

            // resources
            'js/src/resource.js',

            // models
            'js/src/model/model.js',
            'js/src/model/position.js',
            'js/src/model/entity.js',
            'js/src/model/player.js',
            'js/src/model/playerMove.js',
            'js/src/model/beamPos.js',
            'js/src/model/chat.js',
            'js/src/model/mob.js',
            'js/src/model/dropItem.js',
            'js/src/model/skill.js',

            'js/src/entityManager.js',
            'js/src/soundManager.js',
            'js/src/socket/socket.js',
            'js/src/config.js',
            'js/src/bqLabel.js',

            'js/src/chat.js',
            'js/src/inputHandler.js',
            'js/src/mapManager.js',
            'js/src/beamManager.js',
            'js/src/messageLog.js',

            // HUD
            'js/src/hud/hudItem.js',
            'js/src/hud/hpBpBar.js',
            'js/src/hud/expBar.js',
            'js/src/hud/level.js',
            'js/src/hud/statusWindow.js',
            'js/src/hud/hotbar.js',
            'js/src/hud/hud.js',
            // object
            'js/src/object/object.js',
            'js/src/object/dropItem.js',

            // skill
            'js/src/skill/skill.js',
            'js/src/skill/skillFactory.js',
            'js/src/skill/burnStrike.js',

            // entity
            'js/src/entity/entity.js',
            'js/src/entity/entityState.js',
            'js/src/entity/targetLine.js',
            'js/src/entity/animation.js',
            'js/src/entity/player.js',
            'js/src/entity/enemy.js',
            'js/src/beam/beam.js',
            'js/src/beam/beamFactory.js',
            'js/src/ping.js',
            'js/src/camera.js',

            // scene
            'js/src/scene/scene.js',
            'js/src/scene/loading.js',
            'js/src/scene/login.js',
            'js/src/scene/beamQuest.js'
        ]
    };

    if(!d.createElement('canvas').getContext){
        var s = d.createElement('div');
        s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s,d.getElementById(c.tag));

        d.body.style.background = '#ffffff';
        return;
    }

    window.addEventListener('DOMContentLoaded', function () {
        this.removeEventListener('DOMContentLoaded', arguments.callee, false);
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }
        else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'Packed_Release_File.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        d.body.appendChild(s);
        //else if single file specified, load singlefile
    });
})();
