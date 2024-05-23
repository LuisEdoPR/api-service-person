# Welcome to Person Service API with CDK TypeScript

This is a API demo project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   clean and build the project
* `npm run test`    perform the jest unit tests
* `npm run start`  initialize project in local for testing.
* `npm run db:seed`  this script will automatically create random data in the database, By default it will create 15 new records, if you want to create more, you can go to `/src/utils/seed.ts` and set the number of records you want to create.


### Testing Local

If you want to run in local for testing porpose you can run `npm run start` and it will load the project and expose all endpoints in the url `http://127.0.0.1:3000/persons`. You will se this endpoints:

* [POST] create-person at http://127.0.0.1:3000/persons
* [GET] find-all-persons at http://127.0.0.1:3000/persons
* [GET] find-one-person at http://127.0.0.1:3000/persons/{id}
* [PUT] update-person at http://127.0.0.1:3000/persons/{id}
* [DELETE] delete-person at http://127.0.0.1:3000/persons/{id}

**Note:** By default, you don't need to do anything for configuring the DB, The project is using a demo DB in the cloud.

### Testing API from Postman

I added in the folder `postman` a collection with the APIs , so you can import this collection from your postman client and run the requests.

### Unit test

The project constains some unit test using jest, you can run the test with this command `npm run test`. Those are an examples of how can we test with mock for DB. just small example.