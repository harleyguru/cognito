const uuidv4 = require('uuid/v4')

const COGNITO_USER_POOL = {
  userPoolParams: {
    PoolName: uuidv4(),
    MfaConfiguration: 'OFF', // OFF | ON | OPTIONAL
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8, // 'NUMBER_VALUE'
        RequireLowercase: true, // true || false
        RequireNumbers: true, // true || false
        RequireSymbols: false, // true || false
        RequireUppercase: true // true || false
      }
    },
    UsernameAttributes: ['email'],
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_LINK', // CONFIRM_WITH_LINK | CONFIRM_WITH_CODE
      EmailMessage: 'Welcome to our app, please click the link {####}',
      EmailSubject: 'Verification Email - App'
    }
  },
  userPoolClientParams: {
    ClientName: uuidv4(),
    GenerateSecret: false
  }
}

module.exports = {
  COGNITO_USER_POOL
}
