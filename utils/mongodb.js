// utils/mongodb.js
import { MongoClient } from 'mongodb';

let cached = global.mongo;

if (!cached) cached = global.mongo = {};

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const conn = {};
        const dbName = "wave-tasker";
        cached.promise = MongoClient.connect("mongodb+srv://guest:FzuTaVNUHhxbJ6el@wave-tasker.gjk6hka.mongodb.net/")
            .then((client) => {
                conn.client = client;
                return client.db(dbName);
            })
            .then((db) => {
                conn.db = db;
                return conn;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}