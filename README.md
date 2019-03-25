# tkaq

A simple PoC for Trondheim Kommune showing air quality data from sensors mounted on several buildings and cars across Trondheim municipality.

Written in Kotlin using [Javalin](https://javalin.io) for the backend and [Aurelia](https://aurelia.io) for the frontend.

![TKAQ Dashboard Demo](./tkaq_demo.gif)


## Prerequesites

### Backend

- Java 8
- Maven 3

### Frontend

- Node 11
- NPM 6

## Running application

To package a executable jar run

```
mvn clean package
```

This will build the frontend and backend, bundle them into a "fat jar", which will be possible to run wherever you have a JRE installed. 

## Configuration

To configure the tkaq-app you can choose to either provide

1. a `config.json` in the runtime folder (see `config.example.json` for an example of a config file)
2. add system environment variables (recommended)
3. or rely on the the defaults.

The configuration will be used in the priority given above and you can mix and match variables from `config.json`, environment variables and defaults.

The following parameters are available for configuration

- HORDE_API_KEY - API Key towards https://nbiot.engineering
- [PORT = "7000"] - The server port
- [TKAQ_HORDE_ENDPOINT = "https://api.nbiot.engineering"] - The endpoint for fetching data
- [TKAQ_COLLECTION = "17dh0cf43jfi2f"] - The collection id to fetch data from
- [TKAQ_DB_CONNECTION_STRING = "jdbc:sqlite:tkaq.db"] - The database connection string to use for storing data. Defaults to sqlite and supports postgresql JDBC connection strings.

## Development

### Backend

Pick your favorite IDE and set the Main class to be Main.kt and you're on your way. It will default to run Javalin on port 7000 with the configuration given (see [configuration](#configuration)). You should see the application set up the DB and from there the APIs should be ready to use.

Note: Before you can run the application in dev mode you need to have a index.html present in the public fold under resources. Just run a simple `mvn clean install` beforehand and a snapshot of the frontend will be built and added to the resources folder. 

### Frontend

See the corresponding [README](./src/main/frontend/README.md) found in `src/main/frontend`.
