import { CfnCondition, CfnOutput, CfnParameter, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs';

export class EventbridgeToEventbridgeStack extends Stack {
  public readonly eventBus: EventBus

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    /**
     * Cloudformation Parameters
     */
    const eventBusName = new CfnParameter(this, 'EventBusName', {
      type: 'String',
      description: 'Name of the custom event bus that you will receive events on',
    });

    const dmscPublisher = new CfnParameter(this, 'DMSCPublisherAccount', {
      type: 'String',
      description: 'Account ID that is permitted to forward events to the custom event bus',
    });

    const dmscSource = new CfnParameter(this, 'DMSCSource', {
      type: 'String',
      description: 'Only accept events with the "source" set to this value',
    });

    const targetSqsQueueArn = new CfnParameter(this, 'TargetSqsQueueArn', {
      type: 'String',
      default: '',
      description: 'OPTIONAL. ARN of an SQS Queue to forward events to',
    });

    /**
     * Custom EventBridge Event Bus for receiving cross-account events
     */
    this.eventBus = new EventBus(this, 'EventBus', {
      eventBusName: eventBusName.valueAsString,
    });

    /**
     * Allow the DMSC accounts to `putEvents` to this bus
     */
    this.eventBus.addToResourcePolicy(
      new PolicyStatement({
        sid: `AllowPublishingFrom${dmscPublisher.valueAsString}`,
        principals: [new AccountPrincipal(dmscPublisher.valueAsString)],
        actions: ['events:PutEvents'],
        resources: [this.eventBus.eventBusArn],
        conditions: {
          StringLike: {
            'events:source': [dmscSource.valueAsString]
          },
        },
      })
    );

    /**
     * Sample EventBridge Rule to forward events to an SQS Queue.
     * Will only be created if an ARN for an SQS queue is set.
     */
    const queue = Queue.fromQueueArn(this, 'TargetQueue', targetSqsQueueArn.valueAsString);
    const queueTarget = new SqsQueue(queue);
    const rule = new Rule(this, 'DMSCEventsRule', {
      ruleName: 'dmsc-asset-events',
      eventBus: this.eventBus,
      eventPattern: {
        source: [dmscSource.valueAsString],
        detailType: ['asset update'],
      },
      targets: [
        queueTarget
      ],
    });

    const condition = new CfnCondition(this, 'CreateRuleTargetCondition', {
      expression: Fn.conditionNot(Fn.conditionEquals(targetSqsQueueArn, ''))
    });

    rule.node.defaultChild.cfnOptions.condition = condition;

    new CfnOutput(this, 'EventBusArn', {
      name: 'event-bus-arn',
      value: this.eventBus.eventBusArn,
      description: 'ARN of the Custom EventBus. Share this with the DMSC team to complete the integration.',
    });
  }
}
