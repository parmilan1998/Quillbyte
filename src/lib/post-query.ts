// Shared by every route that reads full post objects (list, by-id, by-slug)
// so the shape — category/author/tags plus real like/bookmark/comment
// counts, and (when a viewer is known) whether *they* liked/bookmarked it —
// stays consistent instead of drifting across three separate route files.

export function buildPostInclude(viewerId?: string) {
  return {
    category: true,
    author: { select: { id: true, name: true, image: true } },
    tags: { include: { tag: true } },
    _count: {
      select: {
        likes: true,
        bookmarks: true,
        comments: { where: { status: "VISIBLE" as const, isDeleted: false } },
      },
    },
    ...(viewerId
      ? {
          likes: { where: { userId: viewerId }, select: { id: true } },
          bookmarks: { where: { userId: viewerId }, select: { id: true } },
        }
      : {}),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializePost(post: any) {
  return {
    ...post,
    tags: post.tags.map((t: any) => t.tag), // eslint-disable-line @typescript-eslint/no-explicit-any
    likeCount: post._count?.likes ?? 0,
    bookmarkCount: post._count?.bookmarks ?? 0,
    commentCount: post._count?.comments ?? 0,
    ...(Array.isArray(post.likes) ? { isLiked: post.likes.length > 0 } : {}),
    ...(Array.isArray(post.bookmarks)
      ? { isBookmarked: post.bookmarks.length > 0 }
      : {}),
    _count: undefined,
    likes: undefined,
    bookmarks: undefined,
  };
}
