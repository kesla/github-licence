var Github = require('github')

  , licenceFromTree = function (tree) {
      var licences = tree.filter(function (obj) {
        var key = obj.path.toLowerCase()

        return key.indexOf('licence') !== -1 || key.indexOf('license') !== -1
      })

      if (licences.length === 0)
        return null

      return licences[0]
    }


module.exports = function (github) {

  github = github || new Github({ version: '3.0.0' })

  var getSha = function (user, repo, callback) {
        var opts = {
                user: user
              , repo: repo
              , per_page: 1
            }

        github.gitdata.getAllReferences(opts, function (err, data) {
          if (err)
            return callback(err)

          var sha = data[0].object.sha

          callback(null, sha)
        })

      }

    , getTree = function (user, repo, callback) {

        getSha(user, repo, function (err, sha) {

          if (err)
            return callback(err)

          var opts = {
                  user: user
                , repo: repo
                , sha: sha
              }

          github.gitdata.getTree(opts, callback)

        })

      }

    , getContent = function (user, repo, licence, callback) {

        var opts = {
                user: user
              , repo: repo
              , path: licence.path
            }

        github.repos.getContent(opts, callback)
      }

    , getLicenceString = function (user, repo, licenceFile, callback) {

        getContent(user, repo, licenceFile, function (err, data) {

          if (err)
            return callback(err)

          if (!data)
            return callback(null, null)

          var licenceString = (new Buffer(data.content, data.encoding)).toString();

          callback(null, licenceString)

        })

      }

    , getLicence = function (user, repo, callback) {

        getTree(user, repo, function (err, obj) {

          if (err)
            return callback(err)

          var licenceFile = licenceFromTree(obj.tree)

          if (!licenceFile)
            return callback(null, null)

          getLicenceString(user, repo, licenceFile, callback)

        })

      }

  return getLicence

}