import * as dotenv from "dotenv";
import * as path from "path";
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
const configFilePath = path.resolve(__dirname, "../../.env");
console.log("configFilePath", configFilePath);
dotenv.config({ path: configFilePath });
