import createNodeHelpers from 'gatsby-node-helpers';

export const types = {
  page: 'Page',
  user: 'User'
};

const { createNodeFactory } = createNodeHelpers({
  typePrefix: 'RedditWiki'
});

/* eslint-disable camelcase */
export const transformPageNode = createNodeFactory(types.page, page => {
  const { path, revision_by } = page;
  const sections = path.split('/');

  return {
    ...page,
    path: sections,
    revision_by: revision_by.data,
    internal: {
      mediaType: 'text/markdown'
    }
  };
});
/* eslint-enable camelcase */

export const transformUserNode = createNodeFactory(types.user, user => user);
