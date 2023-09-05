import { join } from 'path';
import { readFileSync } from 'fs';
import { CfnParameter, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class LambdaToEventbridgeStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const serviceName = new CfnParameter(this, 'EventServiceName', {
      type: 'String',
      description: 'An identifier of your service. This will be provided to you by SPE DMSC',
    });
    const detailType = new CfnParameter(this, 'EventDetailType', {
      type: 'String',
      description: 'The type of event that is being published. This will populate the "DetailType" parameter of the EventBridge PutEvents API call',
    });
    const targetEventBus = new CfnParameter(this, 'DestinationEventBusArn', {
      type: 'String',
      description: 'This is the ARN of the EventBridge Bus that the StepFunction will publish to.  Provided by SPE DMSC.',
    });

    const fn = new LambdaFunction(this, 'ForwardEventToEventbridge', {
      code: Code.fromInline(readFileSync(join(__dirname, './lambda-to-eventbridge.handler.cjs'), { encoding: 'utf8' })),
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      environment: {
        SERVICE_NAME: serviceName.valueAsString,
        DETAIL_TYPE: detailType.valueAsString,
        TARGET_EVENTBUS_ARN: targetEventBus.valueAsString,
      },
    });

    fn.addToRolePolicy(new PolicyStatement({
      actions: ['events:PutEvents'],
      resources: [targetEventBus.valueAsString]
    }));
  }
}
