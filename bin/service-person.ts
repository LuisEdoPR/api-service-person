#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServicePersonStack } from '../lib/service-person-stack';

const app = new cdk.App();
new ServicePersonStack(app, 'ServicePersonStack', {});