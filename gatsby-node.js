const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const indexPage = path.resolve('./src/pages/index.js')
  createPage({
    path: `posts`,
    component: indexPage,
  })

  if (!process.env.COSMIC_BUCKET) return

  const blogPost = path.resolve('./src/templates/blog-post.js')
  const result = await graphql(
        `
          {
            allCosmicjsPosts(sort: { fields: [created], order: DESC }, limit: 1000) {
              edges {
                node {
                  slug,
                  title
                }
              }
            }
          }
        `
      )

  if (result.errors) throw result.errors

  const posts = result.data.allCosmicjsPosts.edges
  posts.forEach((post, index) => {
          const next = index === posts.length - 1 ? null : posts[index + 1].node;
          const previous = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: `posts/${post.node.slug}`,
            component: blogPost,
            context: {
              slug: post.node.slug,
              previous,
              next,
            },
          })
  })
}
