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
  const { id, revision_by } = page;
  const path = id.split('/');

  return {
    ...page,
    path,
    revision_by: revision_by.data
  };
});
/* eslint-enable camelcase */

export const transformUserNode = createNodeFactory(types.user, user => user);
