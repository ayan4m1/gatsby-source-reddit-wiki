import axios from 'axios';
import Bottleneck from 'bottleneck';

export default class Request {
  constructor({ subreddit, minTime = 1000 }, reporter) {
    this.rateLimiter = new Bottleneck({
      maxConcurrent: 1,
      minTime
    });
    this.reporter = reporter;
    this.subreddit = subreddit;
  }

  async getUrl(url) {
    this.reporter.verbose(`queuing request for ${url}`);
    return await this.rateLimiter.schedule(() =>
      axios.get(url, {
        headers: {
          'User-Agent': 'GatsbySourceRedditWiki/0.1.0'
        }
      })
    );
  }

  async getPage(pageName) {
    try {
      const response = await this.getUrl(
        `https://api.reddit.com/r/${this.subreddit}/wiki/${pageName}.json`
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
      const response = await this.getUrl(
        `https://api.reddit.com/r/${this.subreddit}/wiki/pages.json`
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
          pages.data.map(async pageName => {
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
