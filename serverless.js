const { mergeDeepRight } = require('ramda')
const CognitoIdentityServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider')
const { Component } = require('@serverless/core')

const {
  removeUserPool,
  orchestrator
  // inputsChanged,
  // updateCognitoUserPool,
  // getUserPool
} = require('./utils')

const defaults = {
  region: 'us-east-1'
}

class AwsCognito extends Component {
  async default(inputs = {}) {
    inputs = mergeDeepRight(defaults, inputs)

    const cognito = new CognitoIdentityServiceProvider({
      region: inputs.region,
      credentials: this.context.credentials.aws
    })

    this.context.status(`Deploying`)

    inputs.name = this.state.name || this.context.resourceId()

    try {
      if (this.state.poolId === undefined) {
        this.context.status(`Creating`)
        this.context.debug(`Creating Cognito User Pool ${inputs.name}.`)
        const orchestratorResponse = await orchestrator({ cognito, inputs })

        const { UserPool, UserPoolClient } = orchestratorResponse

        this.context.debug(
          `Cognito User Pool ${UserPool.Id} was successfully deployed to region ${inputs.region}.`
        )
        this.context.debug(`Deployed Cognito User Pool ARN is ${UserPool.Arn}.`)

        this.state.poolId = UserPool.Id
        this.state.poolArn = UserPool.Arn
        this.state.clientId = UserPoolClient.ClientId
      } else {
        this.context.status(`Updating`)
        this.context.debug(`Update Functionality: Coming Soon`)
        // TOOD: Need to check the params being passed in
        // and compare them against what is now being passed
      }

      this.state.region = inputs.region
      await this.save()

      this.context.debug(`Saved state for Cognito User Pool of ${this.state.poolId}.`)

      const outputs = {
        poolId: this.state.poolId,
        poolArn: this.state.poolArn,
        clientId: this.state.clientId
      }

      return outputs
    } catch (error) {
      this.context.debug(`*************`)
      this.context.debug(`ERROR: ${error}`)
      this.context.debug(`*************`)
      return { error }
    }
  }

  async remove() {
    this.context.status('Removing')

    const cognito = new CognitoIdentityServiceProvider({
      region: this.state.region,
      credentials: this.context.credentials.aws
    })

    await removeUserPool({ cognito, clientId: this.state.clientId, userPoolId: this.state.poolId })
    this.context.debug(`User Pool Client: ${this.state.clientId} has been deleted`)
    this.context.debug(`User Pool: ${this.state.poolId} has been deleted`)

    const outputs = {
      poolId: this.state.poolId,
      clientId: this.state.clientId
    }

    this.state = {}
    await this.save()

    return outputs
  }
}

module.exports = AwsCognito
