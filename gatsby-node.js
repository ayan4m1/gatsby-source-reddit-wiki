import Reddit from 'reddit';
import { createHash } from 'crypto';

const hashData = data =>
  createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');

const fetchPages = async reddit => {
  const pages = await reddit.get('/r/diyejuice/wiki/pages');

  // eslint-disable-next-line
  console.dir(pages);
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

exports.sourceNodes = async ({ actions }, options) => {
  const { createNode } = actions;
  const reddit = new Reddit(options);
  const pages = await fetchPages(reddit);

  if (pages) {
    pages.forEach(page => createNode(transformPage(page)));
  }

  return;
};
