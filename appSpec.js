var init = require('beamQuest/init'),
    request = require('supertest'),
    app = require('./app');

describe('Test: app', function() {
    beforeEach(function() {
        // 前処理
    });

    afterEach(function() {
        // 後処理
    });

    it('/ にアクセスしたら 200 で html を返すかどうか', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .expect(200, done);
    });

});
