import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  RestApi, 
  MethodLoggingLevel,
  LambdaIntegration
} from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path from 'path';
import {DEV_ENVIRONMENT} from '../src/utils/environment';

export class ServicePersonStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    // create RestApi
    const api = new RestApi(this, `ServicePersonApi`, {
      restApiName: `Person CRUD Service`,
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      cloudWatchRole: true,
    });
    
    const personsResource = api.root.addResource("persons");

    // create person
    const createPersonFn =  this.createLambdaFunction('CreatePersonFunction', 'create-person');
    const createPersonLambdaIntegration = new LambdaIntegration(createPersonFn);
    personsResource.addMethod("POST", createPersonLambdaIntegration);

    // find all person
    const findAllPersonsFn = this.createLambdaFunction('FindAllPersonsFunction', 'find-all-persons');
    const findAllPersonsLambdaIntegration = new LambdaIntegration(findAllPersonsFn);
    personsResource.addMethod("GET", findAllPersonsLambdaIntegration);

    // Add person resource by ID
    const personByIdResource = personsResource.addResource("{id}");

    // find person by id
    const findPersonFn = this.createLambdaFunction('FindPersonFunction', 'find-one-person');
    const findPersonLambdaIntegration = new LambdaIntegration(findPersonFn);
    personByIdResource.addMethod("GET", findPersonLambdaIntegration);

    // Update person by id
    const updatePersonFn = this.createLambdaFunction( 'UpdatePersontFunction', 'update-person');
    const updatePersonLambdaIntegration = new LambdaIntegration(updatePersonFn);
    personByIdResource.addMethod("PUT", updatePersonLambdaIntegration);

    // Delete person by id
    const deletePersonFn = this.createLambdaFunction( 'DeletePersontFunction', 'delete-person');
    const deletePersonLambdaIntegration = new LambdaIntegration(deletePersonFn);
    personByIdResource.addMethod("DELETE", deletePersonLambdaIntegration);

  }


  private createLambdaFunction(functionId: string, functionName: string): NodejsFunction {
    const handlerPath = `../src/handlers/${functionName}.ts`;
    return new NodejsFunction(this, functionId, {
      entry: path.resolve(__dirname, handlerPath),
      functionName: functionName,
      handler: 'handler',
      memorySize: 512,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL!,
        ENVIRONMENT: process.env.ENVIRONMENT || DEV_ENVIRONMENT,
      },
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(15),
      bundling: {
        target: 'es2020',
      }
    });
  }

}
