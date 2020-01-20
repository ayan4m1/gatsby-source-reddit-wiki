# gatsby-source-reddit-wiki

Source plugin for pulling data from a public Reddit wiki using the Reddit API.

## Features

## Install

```
$> npm install --save gatsby-source-reddit-wiki
```

## Usage

### gatsby-config.js

```js
module.exports = {
  plugins: [
    // your other plugins here...
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-reddit-wiki',
      options: {
        // required name of subreddit which has its wiki enabled
        // do not include the /r/ prefix
        subreddit: 'aww',
        // optional time in milliseconds to wait in between requests
        // to the reddit API
        minTime: 1000
      }
    }
  ]
};
```

### gatsby-node.js

See [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/) for a complete example illustrating how to render a page component from the wiki data. All of your content is transformed to HTML in `allMarkdownRemark`.

### Querying

Enumerate nodes:

```graphql
{
  allRedditWikiPage {
    nodes {
      id
      path
      content_md
      revision_by {
        name
      }
    }
  }
}
```

Only fetch pages most recently updated by moderators:

```graphql
{
  allRedditWikiPage(filter: { revision_by: { is_mod: { eq: true } } }) {
    nodes {
      id
      path
      content_md
      revision_by {
        name
      }
    }
  }
}
```

## Configuration

| Key       | Required | Type  | Description                                    |
| --------- | -------- | ----- | ---------------------------------------------- |
| subreddit | String   | **Y** | Subreddit name without `/r/` prefix            |
| minTime   | Number   | N     | Minimum time to wait between API request in ms |
