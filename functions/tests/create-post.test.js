const test = require("node:test");
const assert = require("node:assert/strict");

const { createPostOnChannel, buildMetadata } = require("../buffer/createPost");

test("createPostOnChannel blocks facebook story posts before hitting Buffer", async () => {
  const result = await createPostOnChannel({
    apiKey: "test-key",
    channelId: "facebook-channel",
    platform: "facebook",
    text: "Story test",
    mediaUrls: ["https://example.com/poster.jpg"],
    mediaType: "image",
    postType: "story",
  });

  assert.equal(result.ok, false);
  assert.match(result.error, /facebook story publishing is disabled/i);
});

test("buildMetadata includes shouldShareToFeed false for instagram stories", () => {
  const metadata = buildMetadata({
    platform: "instagram",
    mediaType: "image",
    text: "Story test",
    postType: "story",
    youtubeTitle: "",
  });

  assert.deepEqual(metadata, {
    instagram: {
      type: "story",
      shouldShareToFeed: false,
    },
  });
});

test("buildMetadata publishes 9x16 facebook videos as reels", () => {
  const metadata = buildMetadata({
    platform: "facebook",
    mediaType: "video",
    ratio: "9x16",
    text: "Saudi reels",
    postType: "feed",
    youtubeTitle: "",
  });

  assert.deepEqual(metadata, {
    facebook: {
      type: "reel",
    },
  });
});

test("buildMetadata keeps non-9x16 facebook videos as regular posts", () => {
  const metadata = buildMetadata({
    platform: "facebook",
    mediaType: "video",
    ratio: "16x9",
    text: "Saudi widescreen video",
    postType: "feed",
    youtubeTitle: "",
  });

  assert.deepEqual(metadata, {
    facebook: {
      type: "post",
    },
  });
});
