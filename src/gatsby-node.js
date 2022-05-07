import Request from './request';
import { transformPageNode } from './transform';

exports.sourceNodes = async ({ actions, reporter }, options) => {
  try {
    const { subreddit } = options;
    const { createNode } = actions;
    const request = new Request(options, reporter);
    const pages = await request.getPages();

    reporter.info(
      `gatsby-source-reddit-wiki fetched ${pages.length} pages for /r/${subreddit}`
    );
    pages.forEach((page) => createNode(transformPageNode(page)));
  } catch (error) {
    reporter.panicOnBuild(error);
  }

  return;
};
