# service-template-node [![Build Status](https://travis-ci.org/wikimedia/service-template-node.svg?branch=master)](https://travis-ci.org/wikimedia/service-template-node)

Template for creating MediaWiki Services in Node.js

## Getting Started

### Installation

First, clone the repository

```
git clone https://github.com/wikimedia/service-template-node.git
```

Install the dependencies

```
cd service-template-node
npm install
```

You are now ready to get to work!

* Inspect/modify/configure `app.js`
* Add routes by placing files in `routes/` (look at the files there for examples)

You can also read [the documentation](doc/).

### Running the examples

The template is a fully-working example, so you may try it right away. To
start the server hosting the REST API, simply run (inside the repo's directory)

```
npm start
```

This starts an HTTP server listening on `localhost:6927`. There are several
routes you may query (with a browser, or `curl` and friends):

* `http://localhost:6927/_info/`
* `http://localhost:6927/_info/name`
* `http://localhost:6927/_info/version`
* `http://localhost:6927/_info/home`
* `http://localhost:6927/{domain}/v1/siteinfo{/prop}`
* `http://localhost:6927/{domain}/v1/page/{title}`
* `http://localhost:6927/{domain}/v1/page/{title}/lead`
* `http://localhost:6927/ex/err/array`
* `http://localhost:6927/ex/err/file`
* `http://localhost:6927/ex/err/manual/error`
* `http://localhost:6927/ex/err/manual/deny`
* `http://localhost:6927/ex/err/auth`

### Tests

The template also includes a test suite a small set of executable tests. To fire
them up, simply run:

```
npm test
```

If you haven't changed anything in the code (and you have a working Internet
connection), you should see all the tests passing. As testing most of the code
is an important aspect of service development, there is also a bundled tool
reporting the percentage of code covered. Start it with:

```
npm run-script coverage
```

### Preparig for Deployment

* Generate various setting/service files by running gen-init-script.
If it fails, make sure you have ruby installed (`sudo apt-get ruby`).
```
$ ./scripts/gen-init-scripts.rb
```
Add newly generated files in `dist/init-scripts` dir to your repository.

* Creating deployment repository, e.g.  services/my_service/deploy

```
# Add your main GIT repository as a `src` submodule
git submodule add https://gerrit.wikimedia.org/r/mediawiki/services/my_service src

# Add production-only node_modules to the root
cd src/
npm install --production
mv node_modules ..
cd ..
git add -f node_modules   # Must use -f because some npm modules might have .gitignore

# Create link to src/app.js
ln -s src/app.js
```

* Setting up your test/labs/deployent/vagrant server
```
# Clone deployment repo with submodules:
sudo -s
mkdir -p /srv/deployment/my_service
cd /srv/deployment/my_service
git clone --recursive https://gerrit.wikimedia.org/r/mediawiki/services/my_service/deploy deploy

# Setup a link to dev or prod configuration file
# TODO/TBD: Would it make sense to use /etc/my_service.yaml instead of /etc/my_service/config.yaml ?
mkdir -p /etc/my_service
ln -s /srv/deployment/my_service/deploy/src/config.dev.yaml /etc/my_service/config.yaml

# Make a service
ln -s /srv/deployment/my_service/deploy/src/dist/init-scripts/my_service /etc/init.d/my_service

# TODO: Unsure if we need this or how to do it properly (since this its a link, the path is wrong too)
# chmod +x /etc/init.d/my_service
# chown root:root /etc/init.d/my_service

# Run service while `tail -f /var/log/syslog` in another shell
service my_service start
```

### Troubleshooting

In a lot of cases when there is an issue with node it helps to recreate the
`node_modules` directory:

```
rm -r node_modules
npm install
```

Enjoy!

