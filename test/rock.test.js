/* eslint-env mocha */
var assert = require('assert')
var P = require('autoresolve')
var path = require('path')
var fs = require('fs')
var rock = require(P('lib/rock'))
var testutil = require('testutil')
require('terst')

var TEST_PATH = ''

var rockRepo1 = P('test/resources/rocks/node-lib')
var rockRepo2 = P('test/resources/rocks/node-lib-tmpl')

function AFE (file1, file2) {
  EQ(fs.readFileSync(file1).toString(), fs.readFileSync(file2).toString())
}

describe('rock', function () {
  beforeEach(function (done) {
    TEST_PATH = testutil.createTestDir('rock')
    done()
  })

  describe('+ fetchRepo()', function () {
    describe('> when default settings', function () {
      it('should generate a basic project', function () {
        return TEST(rockRepo1)
      })
    })

    describe('> when change open and closing templates', function () {
      it('should generate a basic project', function () {
        return TEST(rockRepo2)
      })
    })
  })
})

function TEST (rockRepo) {
  var testPath = path.join(TEST_PATH, 'create')
  var appName = 'myapp'
  var projectName = 'cool_module'

  // Make test dir:
  fs.mkdirSync(testPath)
  process.chdir(testPath)

  var templateValues = {
    'author': 'JP Richardson',
    'email': 'jprichardson@gmail.com',
    'project-description': 'A cool test for a sweet library.',
    'project-name': 'cool_module'
  }

  return rock.fetchRepo(appName, rockRepo, {templateValues: templateValues})
  .then(function () {
    var outDir = path.join(path.join(testPath, appName))
    var expectDir = P('test/resources/expect/' + appName)

    function AF (file) {
      var file1 = path.join(outDir, file)
      var file2 = path.join(expectDir, file)
      AFE(file1, file2)
    }

    assert(fs.existsSync(outDir))

    AF('LICENSE')
    AF('README.md')
    AF('lib/' + projectName + '.js')
    AF('test/' + projectName + '.test.js')
    AF('ignore_this/READTHIS.md')

    assert(!fs.existsSync(path.join(outDir, '.git')))
    assert(!fs.existsSync(path.join(outDir, '.rock')))
  })
}
