package tkaq

import io.javalin.json.JavalinJson
import java.io.File
import java.lang.IllegalArgumentException

private val CONFIG_FILE: File = File("config.json")
@Suppress("UNCHECKED_CAST")
private val CONFIG: HashMap<String, String> = if (CONFIG_FILE.exists()) JavalinJson.fromJson(CONFIG_FILE.readText(Charsets.UTF_8), HashMap::class.java) as HashMap<String, String> else HashMap()

object Config {
    val endpoint: String = getConfigurationKey("TKAQ_HORDE_ENDPOINT", "https://api.nbiot.engineering")
    val collectionId: String = getConfigurationKey("TKAQ_COLLECTION", "17dh0cf43jfi2f")
    val dbConnectionString: String = getConfigurationKey("TKAQ_DB_CONNECTION_STRING", "jdbc:sqlite:tkaq.db")
    val hordeApiKey: String = getConfigurationKey("HORDE_API_KEY")
    val port: String = getConfigurationKey("PORT", "7000")
}

private fun getConfigurationKey(key: String, fallback: String? = null): String =
        CONFIG[key]
                ?: ProcessBuilder().environment()[key]
                ?: fallback
                ?: throw IllegalArgumentException("Could not read value for configuration key $key. Add to environment variables")