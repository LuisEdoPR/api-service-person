import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

let databaseConnection: typeof mongoose | null = null;

export const getConnection = async (databaseURL: string = process.env.DATABASE_URL) => {
    console.log('getConnection with URL --> ', databaseURL);
    if (!databaseURL) {
        throw new Error('The database connection string is not defined');
    }

    if (databaseConnection === null) {
        console.log('databaseConnection is null, creating a new connection');
        try {
            databaseConnection = await mongoose.connect(databaseURL, {
                serverSelectionTimeoutMS: 5000,
                retryWrites: true,
                w: 'majority',

            });
        } catch (error) {
            console.error("Error MongoDB Connection...");
            console.error(error);
            throw error;
        }
    }

    return databaseConnection;
}
