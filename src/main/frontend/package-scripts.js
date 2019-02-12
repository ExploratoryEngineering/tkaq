const { series, concurrent, rimraf } = require("nps-utils");

module.exports = {
  scripts: {
    default: "nps webpack",
    release: {
      default: "nps release.auto",
      auto: "standard-version --silent",
      patch: "standard-version --silent --release-as patch",
      minor: "standard-version --silent --release-as minor",
      major: "standard-version --silent --release-as major",
    },
    test: {
      default: "nps test.jest",
      all: series(
        "nps lint",
        "nps test.dependencies",
        "nps test.code",
        "nps build",
        "nps test.build",
        "nps e2e",
      ),
      noe2e: series(
        "nps lint",
        "nps test.dependencies",
        "nps test.code",
        "nps build",
        "nps test.build",
      ),
      jest: {
        default: series(rimraf("test/coverage-jest"), "jest --config jest.config.json --forceExit"),
        watch: "jest --config jest.config.json --watch --collectCoverage=false --verbose",
      },
      retire: "retire . --ignore .chrome",
      code: {
        default: series("nps test.jest"),
      },
      dependencies: {
        default: concurrent({
          retire: "nps test.retire",
          npm: "npm audit",
        }),
      },
      build: {
        default: "nps test.build.bundlesize",
        bundlesize: "bundlesize",
      },
    },
    fix: {
      default: series("nps fix.stylelint"),
      stylelint: "stylelint \"src/**/*.scss' 'styles/**/*.scss\" --fix",
    },
    lint: {
      default: concurrent({
        stylelint: "nps lint.stylelint",
        eslint: "nps lint.eslint",
        tslint: "nps lint.tslint",
      }),
      stylelint: "stylelint \"src/**/*.scss' 'styles/**/*.scss\"",
      eslint: "eslint *.js",
      tslint: "tslint 'src/**/*.ts' -c tslint.json && tslint 'test/**/*.ts' -c tslint.json",
    },
    build: "nps webpack.build",
    webpack: {
      default: "nps webpack.server",
      build: {
        before: rimraf("../resources/public"),
        default: "nps webpack.build.production",
        development: {
          default: series("nps webpack.build.before", "webpack --progress --profile"),
          extractCss: series("nps webpack.build.before", "webpack --progress -d --env.extractCss"),
          serve: series.nps("webpack.build.development", "serve"),
        },
        production: {
          default: series(
            "nps webpack.build.before",
            'webpack --progress -p --env.production --env.extractCss  --env.tkaqEndpoint="" --env.tkaqWsEndpoint="" --verbose false',
          ),
          inlineCss: series("nps webpack.build.before", "webpack --progress -p --env.production"),
          serve: series.nps("webpack.build.production", "serve"),
        },
      },
      server: {
        default: "nps webpack.server.hmr",
        simple: "webpack-dev-server -d --inline --env.server --https --port 9000",
        hmr:
          "webpack-dev-server -d --inline --env.server --https --port 9000 --hot --env.extractCss",
        extractCss: "webpack-dev-server -d --inline --env.server --env.extractCss",
        analyze: "webpack -p --env.production --env.extractCss --env.analyze",
      },
    },
    serve: "http-server dist --cors",
  },
};
