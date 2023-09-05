const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { SERVICE_NAME, DETAIL_TYPE, TARGET_EVENTBUS_ARN } = process.env;
exports.handler = async function handler(event) {
  console.debug('Handling SNS Event: ', JSON.stringify(event));
  const client = new EventBridgeClient({});
  const entries = event.Records.map((snsMessage) => ({
    Detail: snsMessage.Sns.Message,
    DetailType: DETAIL_TYPE,
    EventBusName: TARGET_EVENTBUS_ARN,
    Source: SERVICE_NAME,
  }));
  console.debug('Publishing events to EventBridge: ', JSON.stringify(entries));
  const response = await client.send(new PutEventsCommand({ Entries: entries }));
  console.debug('EventBridge response: ', JSON.stringify(response));
};
