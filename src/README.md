# Prerequisites

- Docker
- [SAM Cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- esbuild (npm i -g esbuild)

# Run locally

- sam build
- invoke lambda: sam local invoke 'DiscordFunction' -e ./events/event.json --log-file ./lambda.log --env-vars ./env.json
- npm@6.14.17 (npm i -g npm@6.14.17) (to fix sam build issue with --production flag being deprecated in newer versions)
- node@18.12.1 (or recent for compatibility with node --watch mode, also if you are in Linux or Windows you will probably need to use instead node@19.3.0 for recursive watch to function properly because of fs.watch updates in this newer version)
- npm start

# Possible flags:

-l ./logs.txt
--profile LocalServices
--env-vars environment_variables.json

# Bucket list

- Finish gitlab ci
- Check and correct husky config
