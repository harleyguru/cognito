# Serverless AWS Cognito Component

The Cognito [Serverless Component](https://github.com/serverless-components) allows you to easily and quickly create an AWS Cognito User Pool which you can then reference in other components or deploy by itself.

## Features

- [x] Fast Deployments (~6 seconds on average)
- [x] Supports Various `authTemplates`
- [x] Create New Cognito User Pools & Cognito User Pool Clients
- [x] Remove Cognito User Pools & Cognito User Pool Clients
- [ ] Update Cognito User Pools & Cognito User Pool Clients
- [ ] Create New Cognito Identity Pools
- [ ] Remove Cognito Identity Pools
- [ ] Update Cognito Identity Pools
- [x] Supports Full AWS-SDK Options for Cognito User Pool
- [x] Supports Full AWS-SDK Options for Cognito User Pool Client
- [ ] Supports Full AWS-SDK Options for Cognito Identity Pools

## Contents

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
   - [Basic Configuration](#basic-configuration)
   - [Auth Templates](#auth-templates)
   - [Custom Params](#custom-params)
4. [Deploy](#4-deploy)
5. [Remove](#5-remove)

## 1. Install

```shell
$ npm install -g serverless
```

## 2. Create

Just create the following simple boilerplate:

```
$ touch serverless.yml # more info in the "Configure" section below
$ touch .env           # your AWS api keys
```

```
# .env
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

## 3. Configure

### Basic Configuration
The following is a simple configuration that lets you get up and running with a Cognito User Pool and Cognito User Pool Client which is needed for simple Cognito User Pool authentication for AWS API Gateway and AWS AppSync. Just add it to the `serverless.yml` file:


```yml
cognitoUserPool:
  component: '@serverless/aws-cognito'
  inputs:
    region: us-east-1
    authTemplate: COGNITO_USER_POOL # Creates Cognito User Pool + Cognito User Pool Client
```

This simple configuration above will take the `default` settings which is equivalent to the following:

```yml
cognitoUserPool:
  component: '@serverless/aws-cognito'
  inputs:
    region: us-east-1
    authTemplate: CUSTOM_PARAMS # ** Required - when passing aws-sdk params **
    
    # Docs: https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UserPoolType.html

    # *** Pass the AWS-SDK params for Cognito User Pool directly for custom use cases ***
    userPoolParams:
      PoolName: app-users-dev
      MfaConfiguration: 'OFF'  # OFF | ON | OPTIONAL
      Policies:
        PasswordPolicy:
          MinimumLength: 8  # 'NUMBER_VALUE'
          RequireLowercase: true  # true || false
          RequireNumbers: true  # true || false
          RequireSymbols: false  # true || false
          RequireUppercase: true  # true || false
      UserPoolTags:
        'Owner': 'John Smith'
        'Application': 'App'
      UsernameAttributes:
        - email
      VerificationMessageTemplate:
        DefaultEmailOption: CONFIRM_WITH_LINK  # CONFIRM_WITH_LINK | CONFIRM_WITH_CODE
        EmailMessage: 'Welcome to our app, please click the link {####}'
        EmailSubject: 'Verification Email - App'
   
    # *** Pass the AWS-SDK params for User Pool Client directly for custom use cases ***
    userPoolClientParams:
      ClientName: app-users-dev-client-name
      GenerateSecret: false

    # *** Pass the AWS-SDK params for Cognito Identity Pool directly for custom use cases ***
    # COMING SOON
```

For more advanced usage, keep reading!

### Auth Templates
Auth Templates are a way for you to pass little to zero configuration and have entire AWS Cognito use-cases created automatically.

Auth Templates are defined inside your `serverless.yml` using the following syntax, `authTemplate: [value]`. Currently we support the following `authTemplates`:

- [x] COGNITO_USER_POOL authentication
- [x] CUSTOM_PARAMS authentication (pass AWS-SDK args directly)
- [ ] AWS_IAM authentication
- [ ] MFA with phone_number
- [ ] MFA with email

We would like to make this component even easier to work with so over time we will add additional use-cases. This will give developers even more flexibility and speed up development by specifying an `authTemplate` in your `serverless.yml`:

```yml
cognitoUserPool:
  component: '@serverless/aws-cognito'
  inputs:
    region: us-east-1
    authTemplate: COGNITO_USER_POOL  # COGNITO_USER_POOL | CUSTOM_PARAMS | AWS_IAM | MFA_EMAIL | MFA_SMS
```

### Custom Params
As you can see in the example above, we are passing a property called `authTemplate` which is set to `CUSTOM_PARAMS` then we are able to pass `userPoolParams` and `userPoolClientParams` to create our AWS Cognito User Pool and AWS Cognito User Pool Client with our own custom settings.

Visit the [AWS-SDK Documentation for AWS Cognito](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_UserPoolType.html) and you will see that every argument listed in the documentation can be passed to the component via the `serverless.yml` file using `userPoolParams` or `userPoolClientParams`.

Meaning you're not *limited*, this component supports everything the AWS-SDK supports immediately and always.

## 4. Deploy
To deploy, just run the following command in the directory containing your `serverless.yml file`:

```shell
$ serverless --debug
```

After few seconds (up to a minute if it's your first deployment), you should see an output like this:

```
  cognitoUserPool: 
    poolId:   us-east-1_uX8ixlvfF
    clientId: t1phrmu3tdnhb2h2b60606bup

  1s › cognitoUserPool › done

myApp (master)$
```

## 5. Remove

To remove, just run the following command in the directory containing your `serverless.yml file`:

```shell
$ serverless remove --debug
```

In less than a couple of seconds, you should see something like this:

```
  DEBUG ─ User Pool Client: t1phrmu3tdnhb2h2b60606bup has been deleted
  DEBUG ─ User Pool: us-east-1_uX8ixlvfF has been deleted

  1s › cognitoUserPool › done

myApp (master)$
```

&nbsp;

## New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
