package tkaq.storage

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.postgres.PostgresPlugin
import org.jdbi.v3.sqlite3.SQLitePlugin
import tkaq.Config
import java.time.Instant

import tkaq.models.Collection
import tkaq.models.Device
import tkaq.models.TKAQDataPoint
import java.lang.IllegalArgumentException


private var JsonMapper = jacksonObjectMapper()

object SQLDB : DBInterface {
    private var DBConnection = initiateDB()

    private fun initiateDB(): Jdbi {
        val dbConnection = when {
            Config.dbConnectionString.contains("postgresql") -> {
                // Explicitly loading postgresql driver to ensure runtime finds it in fat jar
                Class.forName("org.postgresql.Driver")
                TKAQ_LOG.debug("Using postgresql")
                Jdbi.create(Config.dbConnectionString).installPlugin(PostgresPlugin())
            }
            Config.dbConnectionString.contains("sqlite") -> {
                // Explicitly loading sqlite driver to ensure runtime finds it in fat jar
                Class.forName("org.sqlite.JDBC")
                TKAQ_LOG.debug("Using sqlite. Connection ${Config.dbConnectionString}")
                Jdbi.create(Config.dbConnectionString).installPlugin(SQLitePlugin())
            }
            else -> throw IllegalArgumentException("SQL Connection string provided is not supported")
        }

        initDB(dbConnection)

        return dbConnection
    }

    override fun addDevice(id: String, collectionId: String, tags: Map<String, String>) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun retrieveDeviceById(id: String): Device {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun deleteDeviceById(id: String) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun retrieveCollections(): List<Collection> = DBConnection.withHandle<List<Collection>, Exception> { handle ->
        handle.createQuery("SELECT id, teamId, tags FROM collections").map { rs, _ ->
            Collection(
                    rs.getString("id"),
                    rs.getString("teamId"),
                    JsonMapper.readValue(rs.getString("tags"))
            )
        }.list()
    }

    override fun deleteCollectionById(id: String) = DBConnection.useHandle<Exception> { handle ->
        handle.createUpdate("DELETE FROM collections WHERE id = :id")
                .bind("id", id)
                .execute()
    }

    override fun addCollection(id: String, teamId: String, tags: Map<String, String>) = DBConnection.useHandle<Exception> { handle ->
        handle.createUpdate("INSERT INTO collections (id, teamId, tags) VALUES (:id, :teamId, :tags)")
                .bind("id", id)
                .bind("teamId", teamId)
                .bind("tags", JsonMapper.writeValueAsString(tags))
                .execute()
    }

    override fun retrieveCollectionById(id: String) = DBConnection.withHandle<Collection?, Exception> { handle ->
        handle.createQuery("SELECT id, teamId, tags FROM collections WHERE id=:id").bind("id", id).map { rs, _ ->
            Collection(
                    rs.getString("id"),
                    rs.getString("teamId"),
                    JsonMapper.readValue(rs.getString("tags"))
            )
        }.firstOrNull()
    }

    override fun addDataPoint(dataPoint: TKAQDataPoint) = DBConnection.useHandle<Exception> { handle ->
        handle.createUpdate("""
            INSERT INTO tkaq_data
            (timestamp, payload, collectionId, deviceId, time, co2Equivalents, vocEquivalents, temperature, pm25, pm10, relHumidity, longitude, latitude, altitude)
            VALUES
            (:timestamp, :payload, :collectionId, :deviceId, :time, :co2Equivalents, :vocEquivalents, :temperature, :pm25, :pm10, :relHumidity, :longitude, :latitude, :altitude)""")
                .bind("timestamp", dataPoint.timestamp.toEpochMilli())
                .bind("payload", dataPoint.payload)
                .bind("collectionId", dataPoint.collectionId)
                .bind("deviceId", dataPoint.deviceId)
                .bind("time", dataPoint.time)
                .bind("co2Equivalents", dataPoint.co2Equivalents)
                .bind("vocEquivalents", dataPoint.vocEquivalents)
                .bind("temperature", dataPoint.temperature)
                .bind("pm25", dataPoint.pm25)
                .bind("pm10", dataPoint.pm10)
                .bind("relHumidity", dataPoint.relHumidity)
                .bind("longitude", dataPoint.longitude)
                .bind("latitude", dataPoint.latitude)
                .bind("altitude", dataPoint.altitude)
                .execute()
    }

    override fun addDataPoints(dataPoints: List<TKAQDataPoint>) = DBConnection.useTransaction<Exception> { handle ->
        if (!dataPoints.isEmpty()) {
            val preparedBatch = handle.prepareBatch("""
                INSERT INTO tkaq_data
                (timestamp, payload, collectionId, deviceId, time, co2Equivalents, vocEquivalents, temperature, pm25, pm10, relHumidity, longitude, latitude, altitude)
                VALUES
                (:timestamp, :payload, :collectionId, :deviceId, :time, :co2Equivalents, :vocEquivalents, :temperature, :pm25, :pm10, :relHumidity, :longitude, :latitude, :altitude)
            """)
            dataPoints.forEach {
                preparedBatch
                        .bind("timestamp", it.timestamp.toEpochMilli())
                        .bind("payload", it.payload)
                        .bind("collectionId", it.collectionId)
                        .bind("deviceId", it.deviceId)
                        .bind("time", it.time)
                        .bind("co2Equivalents", it.co2Equivalents)
                        .bind("vocEquivalents", it.vocEquivalents)
                        .bind("temperature", it.temperature)
                        .bind("pm25", it.pm25)
                        .bind("pm10", it.pm10)
                        .bind("relHumidity", it.relHumidity)
                        .bind("longitude", it.longitude)
                        .bind("latitude", it.latitude)
                        .bind("altitude", it.altitude)
                        .add()
            }
            preparedBatch.execute()
        }
    }

    override fun retrieveDataPoints(fromTimestamp: Long, toTimestamp: Long, limit: Int): List<TKAQDataPoint> = DBConnection.withHandle<List<TKAQDataPoint>, Exception> { handle ->
        handle.createQuery("""
            SELECT timestamp, payload, collectionId, deviceId, time, co2Equivalents, vocEquivalents, temperature, pm25, pm10, relHumidity, longitude, latitude, altitude
            FROM tkaq_data
            WHERE timestamp > :fromTimestamp
            AND timestamp < :toTimestamp
            ORDER BY timestamp DESC
            LIMIT :limit
            """).bind("fromTimestamp", fromTimestamp)
                .bind("toTimestamp", toTimestamp)
                .bind("limit", limit)
                .map { rs, _ ->
                    TKAQDataPoint(
                            timestamp = Instant.ofEpochMilli(rs.getLong("timestamp")),
                            payload = rs.getBytes("payload"),
                            collectionId = rs.getString("collectionId"),
                            deviceId = rs.getString("deviceId"),
                            time = rs.getFloat("time"),
                            co2Equivalents = rs.getInt("co2Equivalents"),
                            vocEquivalents = rs.getInt("vocEquivalents"),
                            temperature = rs.getFloat("temperature"),
                            pm25 = rs.getInt("pm25"),
                            pm10 = rs.getInt("pm10"),
                            relHumidity = rs.getFloat("relHumidity"),
                            longitude = rs.getFloat("longitude"),
                            latitude = rs.getFloat("latitude"),
                            altitude = rs.getFloat("altitude")
                    )
                }.list()
    }

    override fun retrieveDataPointsForCollection(collectionId: String, fromTimestamp: Long, toTimestamp: Long, limit: Int): List<TKAQDataPoint> = DBConnection.withHandle<List<TKAQDataPoint>, Exception> { handle ->
        handle.createQuery("""
            SELECT timestamp, payload, collectionId, deviceId, time, co2Equivalents, vocEquivalents, temperature, pm25, pm10, relHumidity, longitude, latitude, altitude
            FROM tkaq_data
            WHERE timestamp > :fromTimestamp
            AND timestamp < :toTimestamp
            and collectionId = :collectionId
            ORDER BY timestamp DESC
            LIMIT :limit
            """).bind("fromTimestamp", fromTimestamp)
                .bind("toTimestamp", toTimestamp)
                .bind("collectionId", collectionId)
                .bind("limit", limit)
                .map { rs, _ ->
                    TKAQDataPoint(
                            timestamp = Instant.ofEpochMilli(rs.getLong("timestamp")),
                            payload = rs.getBytes("payload"),
                            collectionId = rs.getString("collectionId"),
                            deviceId = rs.getString("deviceId"),
                            time = rs.getFloat("time"),
                            co2Equivalents = rs.getInt("co2Equivalents"),
                            vocEquivalents = rs.getInt("vocEquivalents"),
                            temperature = rs.getFloat("temperature"),
                            pm25 = rs.getInt("pm25"),
                            pm10 = rs.getInt("pm10"),
                            relHumidity = rs.getFloat("relHumidity"),
                            longitude = rs.getFloat("longitude"),
                            latitude = rs.getFloat("latitude"),
                            altitude = rs.getFloat("altitude")
                    )
                }.list()
    }

    override fun retrieveDataPointsForCollectionDevice(collectionId: String, deviceId: String, fromTimestamp: Long, toTimestamp: Long, limit: Int): List<TKAQDataPoint> = DBConnection.withHandle<List<TKAQDataPoint>, Exception> { handle ->
        handle.createQuery("""
            SELECT timestamp, payload, collectionId, deviceId, time, co2Equivalents, vocEquivalents, temperature, pm25, pm10, relHumidity, longitude, latitude, altitude
            FROM tkaq_data
            WHERE timestamp > :fromTimestamp
            AND timestamp < :toTimestamp
            and collectionId = :collectionId
            and deviceId = :deviceId
            ORDER BY timestamp DESC
            LIMIT :limit
            """).bind("fromTimestamp", fromTimestamp)
                .bind("toTimestamp", toTimestamp)
                .bind("collectionId", collectionId)
                .bind("deviceId", deviceId)
                .bind("limit", limit)
                .map { rs, _ ->
                    TKAQDataPoint(
                            timestamp = Instant.ofEpochMilli(rs.getLong("timestamp")),
                            payload = rs.getBytes("payload"),
                            collectionId = rs.getString("collectionId"),
                            deviceId = rs.getString("deviceId"),
                            time = rs.getFloat("time"),
                            co2Equivalents = rs.getInt("co2Equivalents"),
                            vocEquivalents = rs.getInt("vocEquivalents"),
                            temperature = rs.getFloat("temperature"),
                            pm25 = rs.getInt("pm25"),
                            pm10 = rs.getInt("pm10"),
                            relHumidity = rs.getFloat("relHumidity"),
                            longitude = rs.getFloat("longitude"),
                            latitude = rs.getFloat("latitude"),
                            altitude = rs.getFloat("altitude")
                    )
                }.list()
    }

    private fun initDB(dbConnection: Jdbi) {
        TKAQ_LOG.debug("Setting up database...")
        dbConnection.useHandle<Exception> { handle ->
            handle.execute("CREATE TABLE IF NOT EXISTS collections(id TEXT PRIMARY KEY, teamId TEXT, tags TEXT, added TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

            handle.execute("CREATE TABLE IF NOT EXISTS devices(id TEXT PRIMARY KEY, collectionId TEXT, tags TEXT, added TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

            handle.execute("""CREATE TABLE IF NOT EXISTS tkaq_data(
                timestamp BIGINT,
                payload BYTEA,
                collectionId TEXT,
                deviceId TEXT,
                time REAL,
                co2Equivalents INTEGER,
                vocEquivalents INTEGER,
                temperature REAL,
                pm25 INTEGER,
                pm10 INTEGER,
                relHumidity REAL,
                longitude REAL,
                latitude REAL,
                altitude REAL
                )"""
            )
            handle.execute("CREATE INDEX IF NOT EXISTS idx_tkaq_data_timestamp ON tkaq_data(timestamp)")
        }
        TKAQ_LOG.debug("SQL init setup complete!")
    }
}