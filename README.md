The Nubity's Single Page Application
====================================

[![CircleCI](https://circleci.com/gh/nubity/spa.svg?style=svg&circle-token=571c390bb143aba821c2ac08e281d2c840eac9b5)](https://circleci.com/gh/nubity/spa)

MyNubity Single Page Application is a web application for service's customers provided by Nubity Inc.

This document contains information on how to install, configure and start
using it.

1) Installing
-------------

### Use NPM for dependency install

If you don't have NPM yet, download it following the instructions on
its [official site][1].

### Install

    git clone git@github.com:nubity/spa.git path/to/install &&\
    cd path/to/install/ &&\
    npm install --prefix web

2) Configuring
--------------

After install, you'll need to execute a NPM command in order to build some dependencies:

    npm run start --prefix web

### Setting up server

Sample configuration for setting up a web server for MyNubity SPA can be found in
[doc/webserver.md][2].

### Running the built-in server in development environments

At development time, you can also run the built-in HTTP server based on [`http-server`][3].
To use it, you must run:

    npm run http --prefix web

It will expose the app at `http://0.0.0.0:8080/` address.

3) Browsing MyNubity SPA
------------------------

Congratulations! You're now ready to use MyNubity SPA.

To see a real-live page in action, access the following URI:

    /

[1]: https://docs.npmjs.com/getting-started/installing-node
[2]: doc/webserver.md
[3]: https://www.npmjs.com/package/http-server
