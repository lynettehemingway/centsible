import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri);

try {
    await client.connect();

    await client.db("test").command({ping: 1});
    console.log("Ping successful");

} catch(err){
    console.error(err);
}

let db = client.db("users");

export default db;