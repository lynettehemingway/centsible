import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri);

try {
    await client.connect();

    await client.db("test").command({ping: 1});
    console.log("Ping Successful");

} catch(err){
    console.error(err);
}

let db = client.db("centsible");

export default db;