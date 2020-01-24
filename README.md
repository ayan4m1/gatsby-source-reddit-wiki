# gatsby-source-reddit-wiki

Source plugin for pulling data from a public or private Reddit wiki using the Reddit API.

## Features

## Install

```
$> npm install --save gatsby-source-reddit-wiki
```

## API Setup

1. Go to [Reddit's apps page](https://www.reddit.com/prefs/apps)
2. Click "create app"
3. Enter any name
4. Select "script" application type
5. Enter anything for description, about URI, and redirect URI
6. Click "create app"
7. Ensure the user you will use to authenticate has been granted access to the app

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
        // the following four fields are REQUIRED
        username: 'spez',
        password: 'ReallySecure',
        appId: '8sjcAWF_98VAS',
        appSecret: 'ck7S_ACJiobijq2v9asjiv',
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

**NOTE**: You cannot use this plugin with a Reddit account that has 2FA enabled.

| Key       | Type   | Required | Description                                    |
| --------- | ------ | -------- | ---------------------------------------------- |
| username  | String | **Y**    | Reddit username                                |
| password  | String | **Y**    | Reddit password                                |
| appId     | String | **Y**    | Reddit-generated app ID                        |
| appSecret | String | **Y**    | Reddit-generated app secret                    |
| subreddit | String | **Y**    | Subreddit name without `/r/` prefix            |
| minTime   | Number | N        | Minimum time to wait between API request in ms |
