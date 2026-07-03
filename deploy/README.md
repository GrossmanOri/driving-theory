# Deployment — GitHub Actions + AWS OIDC

The site auto-deploys to S3 + CloudFront on every push to `main`
(`.github/workflows/deploy.yml`). Authentication uses **GitHub OIDC**, so no
long-lived AWS access keys exist anywhere — GitHub proves its identity to AWS
per run and receives short-lived, tightly-scoped credentials.

## One-time setup (AWS Console, as account owner)

### 1. Add the GitHub OIDC identity provider

IAM → **Identity providers** → **Add provider** → **OpenID Connect**

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

(Skip if it already exists.)

### 2. Create the deploy role

IAM → **Roles** → **Create role** → **Web identity**

- Identity provider: `token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`
- GitHub organization: `GrossmanOri`, repository: `driving-theory`, branch: `main`

Attach a permissions policy using `iam-permissions-policy.json` (replace
`ACCOUNT_ID`). The console generates the trust policy for you; it should match
`iam-trust-policy.json`. Name the role e.g. `github-deploy-driving-theory`.

### 3. Store the role ARN as a GitHub secret

Copy the new role's ARN, then:

```bash
gh secret set AWS_DEPLOY_ROLE_ARN --repo GrossmanOri/driving-theory --body "arn:aws:iam::ACCOUNT_ID:role/github-deploy-driving-theory"
```

## Deploy

Just push to `main` — or trigger manually from the **Actions** tab
(**Deploy to AWS** → **Run workflow**).

## Scope

The role can only: list/read/write/delete objects in `s3://theory-app-web-ori`
and create invalidations on CloudFront distribution `E3U251UNW6ZOD`. Nothing else.
