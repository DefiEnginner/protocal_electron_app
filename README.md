**Note: The Custom Protocol Electron App is currently experimental and not expected to
work with the current Custom Protocol Core release. An official beta release will be
published soon.**

Custom Protocol Electron App
===================

A modern cross-platform GUI for Custom Protocol built with
[Electron](https://electronjs.org/) & [Vue.js](https://vuejs.org/).

Prerequisites
-------------

Make sure you back up your Custom Protocol before developing on this app.

You need the following prerequisites to be able to build and develop the project
on your local machine.

- Node.js
- npm

Install
-------

Clone the repo:

```sh

```

Change directory into the cloned repository:

```sh
cd Custom-Protocol-Electron
```

Install dependencies with npm:

```sh
npm install
```

```sh
mkdir bin

# Fetch the applicable release from https://github.com/Custom Protocol/Custom Protocol/releases
# for your OS and architecture and unzip the `Custom Protocold` and `Custom Protocol-cli` binaries
# into the `bin` folder.
```

Development
-----------

Run in development mode:

```sh
npm run dev
```

Before submitting a patch we highly recommend running the linting and formatting
scripts:

```sh
npm run lint-fix && npm run lint-styles-fix
```

Package for Distribution
------------------------

To package the app for distribution (don't forget to copy the `Custom Protocold` and
`Custom Protocol-cli` binaries into the `bin` folder before packaging the app):

```sh
npm run package
```

After running the package command the executable will be located in the
`release` folder.

Code Signing
------------

To code sign the packaged app you must set the following environment variables
before running `npm run package`.

macOS:

```sh
# macOS - Name of certificate to retrieve from Keychain
export CSC_NAME='Custom Protocol Limited'
```

Windows:

```sh
# Windows (PowerShell) - Path to *.pfx certificate relative to root of project
$env:CSC_LINK='build\Custom ProtocolLimited.pfx'

# Optional - The password to decrypt the certificate given in CSC_LINK
$env:CSC_KEY_PASSWORD='Password123!'
```

Contributing
------------

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of
conduct, and the process for submitting pull requests to us.

License
-------

Licensed under the [MIT](LICENSE.md) License.
