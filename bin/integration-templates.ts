#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaToEventbridgeStack } from '../lib/lambda-to-eventbridge-stack';
import { StepfunctionsToEventbridgeStack } from '../lib/stepfunctions-to-eventbridge-stack';

const app = new cdk.App();
new LambdaToEventbridgeStack(app, 'LambdaToEventbridgeStack', {});
new StepfunctionsToEventbridgeStack(app, 'StepfunctionsToEventbridgeStack', {});
