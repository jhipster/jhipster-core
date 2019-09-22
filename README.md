[![Azure DevOps Build Status][azure-devops-image]][azure-devops-url-main] [![Dependency Status][dependency-image]][dependency-url] [![devDependency Status][devDependency-image]][devDependency-url] [![peerDependency Status][peerDependency-image]][peerDependency-url]


Welcome to the official repository of everything common to JHipster and its projects, like the JDL (JHipster Domain Language).

Please read our [guidelines](/CONTRIBUTING.md#submitting-an-issue) before submitting an issue.
If your issue is a bug, please use the bug template pre-populated [here](https://github.com/jhipster/jhipster-core/issues/new?template=BUG_REPORT.md).
For feature requests and queries you can use [this template](https://github.com/jhipster/jhipster-core/issues/new?template=FEATURE_REQUEST.md).

### Releasing

1. Commit any changes done, to ensure working directory is clean
2. Run the release script - You need to be logged into NPM
    * To release a patch version, simply run `npm run release-patch`
    * To release a minor version, simply run `npm run release-minor`
    * To release a major version, simply run `npm run release-major`



[azure-devops-image]: https://dev.azure.com/jhipster/jhipster-core/_apis/build/status/jhipster.jhipster-core?branchName=master
[azure-devops-url-main]: https://dev.azure.com/jhipster/jhipster-core/_build

[travis-image]: https://travis-ci.org/jhipster/jhipster-core.svg?branch=master
[travis-url]: https://travis-ci.org/jhipster/jhipster-core

[dependency-image]: https://david-dm.org/jhipster/jhipster-core.svg
[dependency-url]: https://david-dm.org/jhipster/jhipster-core

[devDependency-image]: https://david-dm.org/jhipster/jhipster-core/dev-status.svg
[devDependency-url]: https://david-dm.org/jhipster/jhipster-core#info=devDependencies

[peerDependency-image]: https://david-dm.org/jhipster/jhipster-core/peer-status.svg
[peerDependency-url]: https://david-dm.org/jhipster/jhipster-core#info=peerDependencies