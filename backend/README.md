# Backend — theory-api

A single Lambda (`backend/lambda/index.mjs`) fronted by an API Gateway HTTP API.

## Routes
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/questions` | public | All questions from `TheoryQuestions` |
| GET | `/progress` | Cognito JWT | The user's progress from `UserData` |
| POST | `/progress` | Cognito JWT | Upsert the user's progress items |

## Environment variables (set on the Lambda)
- `QUESTIONS_TABLE=TheoryQuestions`
- `USERDATA_TABLE=UserData`

## IAM (Lambda execution role)
- `AWSLambdaBasicExecutionRole` (logs)
- DynamoDB access to the two tables (Scan/Query on `TheoryQuestions`,
  Query/BatchWriteItem on `UserData`). `AmazonDynamoDBFullAccess` works to start;
  scope down later.

## Auth model
`userId` is taken from the verified Cognito JWT (`requestContext.authorizer.jwt.claims.sub`).
A client can never write to another user's data — the Lambda overwrites `userId`
on every saved item with the token's subject.
