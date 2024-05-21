// utils/mongodb.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();


let cached = global.mongo;

if (!cached) cached = global.mongo = {};

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const conn = {};
        const dbName = "wave-tasker";
        const uri = process.env.MONGODB_URI;
        cached.promise = MongoClient.connect(uri)
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