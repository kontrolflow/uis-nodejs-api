const {MongoClient} = require('mongodb');
const url = "mongodb://"+process.env.MDB_USER+":"+process.env.MDB_PASS+"@"+process.env.MDB_HOST+"/"
const db = process.env.MDB_DB

class DB {

    client;

    constructor(db) {
        this.connect()
    }

    async connect() {
        this.client = new MongoClient(url);
        try {
            await this.client.connect();  
        } catch (e) {
            console.error(e);
        }
    }

    query() {
        return this.client.db(db);
    }

    async close() {
        try {
            setTimeout(() => {this.client.close()}, 1500)
        } catch (e) {
            console.error(e);
        }
    }
 
}

module.exports = DB