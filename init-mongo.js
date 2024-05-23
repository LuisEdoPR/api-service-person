//env variables
const dataBaseRoot = process.env.MONGO_INITDB_DATABASE;
const dataBaseUserNameRoot = process.env.MONGO_INITDB_ROOT_USERNAME;
const dataBasePasswordRoot = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dataBase = process.env.TEST_DATABASE;
const dataBaseUserName = process.env.TEST_DATABASE_USERNAME;
const dataBasePassword = process.env.TEST_DATABASE_PASSWORD;

// Create Database Admin
admin_db = db.getSiblingDB(dataBaseRoot);
if (db.getUser(dataBaseUserNameRoot) == null) {
    admin_db.createUser({
        user: dataBaseUserNameRoot,
        pwd: dataBasePasswordRoot,
        roles: [{role: "userAdminAnyDatabase", db: dataBaseRoot}]
    });
}

// Create Database
db = db.getSiblingDB(dataBase);

//Create User
db.createUser({
    user: dataBaseUserName,
    pwd: dataBasePassword,
    roles: [
        { role: "readWrite", db: dataBase }
    ]
});
