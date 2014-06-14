var init = require('beamQuest/init'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    kvs = require('./kvs').createClient();

describe('Test: app/beamQuest/store/kvs', function() {

    beforeEach(function() {
        // 前処理

        kvs.set('1', '追加された文字列');
    });

    afterEach(function() {
        // 後処理

        kvs.end();
    });

    it('kvs に追加できる', function(done) {
        kvs.get('1', function(error, value) {
            expect(value).to.be('追加された文字列');
            done();
        });
    });

});
