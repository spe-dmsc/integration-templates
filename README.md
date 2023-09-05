DMSC Integration Templates
==========================

This repository contains example templates for integrating with the Sony
Pictures suite of applications servicing the Digital Media Supply Chain.

All templates are written in the TypeScript variant of the [AWS CDK][0] and can
be found in the [lib/](/lib) directory.  These have been synthesized to YAML
Cloudformation templates in the [templates/](/templates) directory.

Contact DMSC / CPT support for configuration details.

## Registry / Media Landing Integrations

All incoming events must ultimately reach a DMSC EventBridge Bus.  There are
multiple strategies for getting a message to the bus, as diagrammed below:

![Integration Strategies, using AWS Resources to PutEvents to
EventBridge](/doc/integrations_diagram.svg)


### Currently Available Templates:

* [LambdaToEventbridge](/templates/LambdaToEventbridgeStack.yaml) <br>
  Sends events via an AWS Lambda Function. This can be used for events from SNS,
  SQS, API Gateway, or any other available Lambda trigger.  The reference
  template provided here specifically is written for SNS, expecting a JSON
  string as the message body

* [StepfunctionsToEventbridge](/templates/StepfunctionsToEventbridgeStack.yaml) <br>
  Sends events via an AWS Step Functions step. This can be used for events from
  API Gateway, EventBridge, or any other Step Functions [invocation method][1]

## Useful commands

* `make`            re-builds the Cloudformation templates via `cdk synth`

[0]: https://docs.aws.amazon.com/cdk/v2/guide/home.html
[1]: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-invoke-sfn.html
