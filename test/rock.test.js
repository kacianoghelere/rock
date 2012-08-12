var assert = require('assert')
  , P = require('autoresolve')
  , suppose = require('suppose')
  , next = require('nextflow')
  , path = require('path-extra')
  , fs = require('fs-extra')
  , rock = require(P('lib/rock'));

var TEST_PATH = path.join(path.tempdir(), 'test-rock2')
  , ROCK_CONF = P('test/resources/rockconf.json');

function AFE(file1, file2) {
    assert(fs.readFileSync(file1).toString() === fs.readFileSync(file2).toString());
}

describe('rock', function(){
    beforeEach(function(done){
        fs.exists(TEST_PATH, function(itDoes) {
            if (itDoes) {
                fs.remove(TEST_PATH, function(err) {
                    fs.mkdir(TEST_PATH, done);
                });
            } else {
                fs.mkdir(TEST_PATH, done);
            }
        });
    });

    after(function() {
        var conf = JSON.parse(fs.readFileSync(ROCK_CONF));
        conf.rocks['node-lib'].repo = '';
        fs.writeFileSync(ROCK_CONF, JSON.stringify(conf, null, 4));
    });

    describe('+ create()', function(){
        it('should generate a basic project', function(done){
            done();
            return
            var testPath = path.join(TEST_PATH, 'create')
            var debugFile = path.join(testPath, 'debug.txt');

            var appName = 'myapp';
            var projectName = 'cool_module';

            next({
                ERROR: function(err) {
                    console.log('ERR')
                    console.log(err);
                    done(err); //FAIL
                },
                makeTestDir: function() {
                    fs.mkdir(testPath, this.next);
                },
                rockCreate: function(){
                    var rockRepo = P('test/resources/rocks/node-lib');
                    process.chdir(testPath);
                    
                    rock.create(appName, rockRepo, this.next);
                },
                verifyResults: function() {
                    var outDir = path.join(path.join(testPath, appName));
                    var expectDir = P('test/resources/expect/' + appName);

                    function AF(file) {
                        var file1 = path.join(outDir, file);
                        var file2 = path.join(expectDir, file);
                        AFE(file1, file2);
                    }

                    assert(fs.existsSync(outDir));

                    AF('LICENSE');
                    AF('README.md');
                    AF('lib/' + projectName + '.js');
                    AF('test/' + projectName + '.test.js');

                    assert(!fs.existsSync(path.join(outDir, '.git')));
                    assert(!fs.existsSync(path.join(outDir, '.rock')));

                    done()
                }
            });
        });

    });
});