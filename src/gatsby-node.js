import axios from 'axios';
import { createHash } from 'crypto';

const hashData = data =>
  createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');

const fetchPages = async subreddit => {
  const pages = await axios({
    url: `https://api.reddit.com/r/${subreddit}/wiki/pages.json`,
    method: 'GET'
  });

  if (pages && pages.kind === 'wikipagelisting') {
    return pages.data;
  }
};

const transformPage = async page => ({
  id: page.id,
  parent: null,
  children: [],
  internal: {
    type: 'PostField',
    contentDigest: hashData(page),
    mediaType: 'text/markdown',
    content: JSON.stringify()
  }
});

exports.sourceNodes = async ({ actions }, { subreddit }) => {
  const { createNode } = actions;
  const pages = await fetchPages(subreddit);

  if (pages) {
    pages.forEach(page => createNode(transformPage(page)));
  }

  return;
};
