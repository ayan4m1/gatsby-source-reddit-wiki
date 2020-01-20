import createNodeHelpers from 'gatsby-node-helpers';

export const types = {
  page: 'Page',
  user: 'User'
};

const { createNodeFactory, generateTypeName } = createNodeHelpers({
  typePrefix: 'RedditWiki'
});

/* eslint-disable camelcase */
export const transformPageNode = createNodeFactory(types.page, page => {
  const { path, revision_by, content_md } = page;
  const sections = path.split('/');

  return {
    ...page,
    path: sections,
    revision_by: revision_by.data,
    internal: {
      type: generateTypeName(types.page),
      mediaType: 'text/markdown',
      content: content_md
    }
  };
});
/* eslint-enable camelcase */

export const transformUserNode = createNodeFactory(types.user, user => user);
