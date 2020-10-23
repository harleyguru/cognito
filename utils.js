const { COGNITO_USER_POOL } = require('./authTemplates')

/**
 * Documentation:
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
 */
const createUserPoolClient = async ({ cognito, inputs, userPoolId }) => {
  inputs.userPoolClientParams.UserPoolId = userPoolId
  const userPoolClientResponse = await cognito
    .createUserPoolClient(inputs.userPoolClientParams)
    .promise()
  return userPoolClientResponse
}

/**
 * Documentation:
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
 */
const createUserPool = async ({ cognito, inputs }) => {
  const userPoolResponse = await cognito.createUserPool(inputs.userPoolParams).promise()

  const userPoolClientResponse = await createUserPoolClient({
    cognito,
    inputs,
    userPoolId: userPoolResponse.UserPool.Id
  })

  return {
    UserPool: userPoolResponse.UserPool,
    UserPoolClient: userPoolClientResponse.UserPoolClient
  }
}

/**
 * Documentation:
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPool-property
 */
const removeUserPool = async ({ cognito, userPoolId, clientId }) => {
  await cognito.deleteUserPoolClient({ ClientId: clientId, UserPoolId: userPoolId }).promise()
  await cognito.deleteUserPool({ UserPoolId: userPoolId }).promise()
}

/**
 *
 */
const inputsChanged = async ({}) => {}

/**
 *
 */
const getUserPool = async ({}) => {}

/**
 *
 */
const updateCognitoUserPool = async ({}) => {}

/**
 * @description orchestrator branches out to various authTemplates
 * for additional information, check out the README.
 */
const orchestrator = async ({ cognito, inputs }) => {
  if (inputs.authTemplate) {
    if (inputs.authTemplate === 'COGNITO_USER_POOL') {
      inputs = { ...inputs, ...COGNITO_USER_POOL }
      return await createUserPool({ cognito, inputs })
    } else if (inputs.authTemplate === 'CUSTOM_PARAMS') {
      if (!inputs.userPoolParams) {
        inputs.userPoolParams = COGNITO_USER_POOL.userPoolParams
      }
      if (!inputs.userPoolClientParams) {
        inputs.userPoolClientParams = COGNITO_USER_POOL.userPoolClientParams
      }
      return await createUserPool({ cognito, inputs })
    }
  } else {
    throw 'Missing inputs.authTemplate'
  }
}

module.exports = {
  orchestrator,
  createUserPool,
  createUserPoolClient,
  removeUserPool,
  inputsChanged,
  getUserPool,
  updateCognitoUserPool
}
