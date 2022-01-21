import { App } from '@aws-cdk/core'
import * as ssp from '@aws-quickstart/ssp-amazon-eks';

const app = new App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

const blueprint = ssp.EksBlueprint.builder()
  .account(account)
  .region(region)
  .addOns()
  .teams();
  
// Build Codepipeline
ssp.CodePipelineStack.builder()
  .name("ssp-eks-workshop-pipeline")
  .owner("your-github-username")
  .repository({
      repoUrl: 'ssp-workshop',
      credentialsSecretName: 'github-token',
      targetRevision: 'main'
  })
  // Add stages
  .stage({
    id: 'prod',
    stackBuilder: blueprint.clone('us-west-2')
  })
  .build(app, 'pipeline-stack', {env});