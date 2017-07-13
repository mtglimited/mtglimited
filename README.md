# mtglimited

## Development

In the root of the repository, run
```
yarn start
```

To run the firebase functions locally, open another terminal tab and run
```
cd functions
firebase serve --only functions
```

## Deployment
When you merge a PR into master, TravisCI will automatically deploy the latest code
