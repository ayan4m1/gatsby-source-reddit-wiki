import createNodeHelpers from 'gatsby-node-helpers';

export const types = {
  page: 'Page',
  user: 'User'
};

const { createNodeFactory, generateNodeId } = createNodeHelpers({
  typePrefix: 'RedditWiki'
});

export const transformPageNode = createNodeFactory(types.page, page => {
  return {
    ...page,
    revisedBy: generateNodeId(types.user, page.revised_by)
  };
});

export const transformUserNode = createNodeFactory(types.user, user => user);
