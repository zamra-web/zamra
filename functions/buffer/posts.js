const { bufferQuery } = require("./client");

const LIST_POSTS_QUERY = `
  query ListPostsForStatus(
    $organizationId: OrganizationId!
    $channelIds: [ChannelId!]
    $statuses: [PostStatus!]
    $first: Int!
  ) {
    posts(
      first: $first
      input: {
        organizationId: $organizationId
        filter: {
          status: $statuses
          channelIds: $channelIds
        }
      }
    ) {
      edges {
        node {
          id
          createdAt
          channelId
        }
      }
    }
  }
`;

async function listPostsByStatus(apiKey, {
  organizationId,
  channelIds,
  statuses,
  first = 200,
}) {
  const data = await bufferQuery(apiKey, LIST_POSTS_QUERY, {
    organizationId,
    channelIds,
    statuses,
    first,
  });
  const edges = data && data.posts && Array.isArray(data.posts.edges) ? data.posts.edges : [];
  return edges.map((edge) => edge && edge.node).filter(Boolean);
}

async function getPostStatesById(apiKey, {
  organizationId,
  channelId,
  postIds,
  first = 200,
}) {
  const ids = new Set((postIds || []).map((id) => String(id || "").trim()).filter(Boolean));
  if (!ids.size) return {};

  const out = {};
  const statusChecks = ["sent", "error", "sending", "scheduled"];

  for (const status of statusChecks) {
    const posts = await listPostsByStatus(apiKey, {
      organizationId,
      channelIds: [channelId],
      statuses: [status],
      first,
    });
    posts.forEach((post) => {
      const postId = String(post.id || "").trim();
      if (ids.has(postId) && !out[postId]) {
        out[postId] = {
          id: postId,
          status,
          createdAt: post.createdAt || null,
          channelId: post.channelId || channelId,
        };
      }
    });
  }

  return out;
}

module.exports = {
  listPostsByStatus,
  getPostStatesById,
};
