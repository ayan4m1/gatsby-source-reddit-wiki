import Reddit from './reddit';

export default class Request {
  constructor(
    { username, password, appId, appSecret, subreddit, minTime = 1000 },
    reporter
  ) {
    try {
      this.reddit = new Reddit({
        username,
        password,
        appId,
        appSecret,
        rateLimiter: {
          maxConcurrent: 1,
          minTime
        }
      });
    } catch (error) {
      return reporter.panicOnBuild(error);
    }

    this.reporter = reporter;
    this.subreddit = subreddit;
  }

  async getPage(pageName) {
    try {
      const response = await this.reddit.request(
        `/r/${this.subreddit}/wiki/${pageName}?`
      );
      const { data: page } = response;
      const valid = page && page.kind === 'wikipage' && page.data.content_md;

      this.reporter.info(`${valid ? 'parsed' : 'failed to parse'} ${pageName}`);
      return valid
        ? {
            id: pageName,
            path: pageName,
            ...page.data
          }
        : null;
    } catch (error) {
      this.reporter.panicOnBuild(error);
    }
  }

  async getPages() {
    try {
      const response = await this.reddit.request(
        `/r/${this.subreddit}/wiki/pages?`
      );
      const { data: pages } = response;
      const valid =
        pages && pages.kind === 'wikipagelisting' && Array.isArray(pages.data);

      if (!valid) {
        return [];
      }

      this.reporter.info(
        `gatsby-source-reddit-wiki ${pages.data.length} wiki pages for /r/${this.subreddit}...`
      );
      return (
        await Promise.all(
          pages.data.map(async (pageName) => {
            const page = await this.getPage(pageName);

            return page ? [page] : [];
          })
        )
      ).flat();
    } catch (error) {
      this.reporter.panicOnBuild(error);
    }
  }
}
