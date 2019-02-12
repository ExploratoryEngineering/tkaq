# TKAQ Frontend

## Prerequesites

- NPM >= 5
- Node >= 8

## Installation of dependencies

Run `npm i`

## Development

Run `npm start`

This will start a web server on https://localhost:9000. Accept the untrusted certificate, well, because it's unsigned and for localhost.

### Configuration

We default the backend to go towards `https://tkaq.herokuapp.com/`, but when developing this might not be preferrable as you might have your backend server running.

Ex: To set the backend to `http://localhost:7000` and websocket server to `ws://localhost:7000`

```bash
npm start "webpack.server.hmr --env.tkaqEndpoint=http://localhost:7000 --env.tkaqWsEndpoint=ws://localhost:7000"
```

#### Configuration overriding

The environment variables who can be configured through the CLI is the following

- tkaqEndpoint: string
- tkaqWsEndpoint: string
- production: boolean

## Test

Run all tests

```bash
npm start test.all
```

Running this command will run all the tests below

### Unit/Jest

```bash
npm start test.jest
```

This will run tests found in the project and create a coverage report in `test/coverage-jest` which can be opened locally in your favorite browser.

#### Jest Dev

When developing it is easier to have Jest enabled to watch for changes. You can run

```bash
npm start test.jest.watch
```

Which will start Jest in watch mode and let you see the results of the running tests near instantaneous.

### Built app

#### Bundlesize

```bash
npm start build # This builds a production build to be tested
npm start test.build
```

NOTE: This will only test the prebuilt app, ie whatever lies in `./dist`.

### Linting

```bash
npm start lint
```

Will run all linting below

#### Linting of JavaScript

```bash
npm start lint.eslint
```

#### Linting of TypeScript

```bash
npm start lint.tslint
```

#### Linting of SCSS

```bash
npm start lint.stylelint
```

### Testing deps for vulnerabilities

```bash
npm start test.dependencies
```

## Build

Run `npm start build`

This will build an optimized build for production purposes and output to the `dist` folder.
