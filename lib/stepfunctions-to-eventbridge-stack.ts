import { CfnParameter, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  DefinitionBody,
  StateMachine,
  TaskInput,
} from 'aws-cdk-lib/aws-stepfunctions';
import { EventBridgePutEvents } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { EventBus } from 'aws-cdk-lib/aws-events';

export class StepfunctionsToEventbridgeStack extends Stack {
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

    const sendEvent = new EventBridgePutEvents(this, 'Publish message as EventBridge Event', {
      entries: [{
        detail: TaskInput.fromJsonPathAt('$'),
        detailType: detailType.valueAsString,
        eventBus: EventBus.fromEventBusArn(this, 'DestinationEventBus', targetEventBus.valueAsString),
        source: serviceName.valueAsString,
      }],
    });

    new StateMachine(this, 'RegistryPublisherStateMachine', {
      definitionBody: DefinitionBody.fromChainable(sendEvent)
    });
  }
}
