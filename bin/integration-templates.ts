#!/usr/bin/env node
import 'source-map-support/register';
import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { LambdaToEventbridgeStack } from '../lib/lambda-to-eventbridge-stack';
import { StepfunctionsToEventbridgeStack } from '../lib/stepfunctions-to-eventbridge-stack';
import { EventbridgeToEventbridgeStack } from '../lib/eventbridge-to-eventbridge-stack'

const app = new App();
const defaultOpts = {
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  })
};
new LambdaToEventbridgeStack(app, 'LambdaToEventbridgeStack', defaultOpts);
new StepfunctionsToEventbridgeStack(app, 'StepfunctionsToEventbridgeStack',defaultOpts);
new EventbridgeToEventbridgeStack(app, 'EventbridgeToEventbridgeStack',defaultOpts);
