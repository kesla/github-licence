var githubLicence = require('./github-licence')()

githubLicence('kesla', 'github-licence', function (err, licence) {
  console.log('Thie licence of github-licence');
  console.log(licence)
})
