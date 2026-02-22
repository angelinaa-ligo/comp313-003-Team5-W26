// /kinkeep/apps/web/src/components/PostCard.tsx
/** PostCard.tsx
 * Displays a single post with media, actions, and comments.
 *
 * Functions
 * - PostCard(): Renders a post including author info,
 *   text content, likes, comments, and sharing functionality.
 */

import { useState, useRef } from 'react';
import LikeButton from './LikeButton';
import CommentCard from './CommentCard';
import Toast from './Toast';
import ShareModal from './ShareModal';
import { useToast } from '../hooks/useToast';
import type { Post } from '../types';
import { AuthService } from '../services/AuthService';

type Props = {
  post: Post;
};
/** PostCard()
 * Presents a complete social feed post, including:
 * - Author avatar and name
 * - Optional media
 * - Post text
 * - Like, comment, and share actions
 * - Comment composer for adding new comments
 * 
 * Handles optimistic UI updates, server persistence,
 * error fallbacks, and toast notifications.
 *
 * @returns React component representing a post card
 */
export default function PostCard({ post }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState<Post['comments']>(
    post.comments || []
  );
  const [loadingComments, setLoadingComments] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);

  const [newComment, setNewComment] = useState('');
  const posting = useRef(false);
  const { toast, showSuccess, hideToast } = useToast();

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <article className="post-card">
      {/* header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.avatarText ?? post.author.slice(0, 1).toUpperCase()}
        </div>
        <div className="post-author">{post.author}</div>
      </div>

      {/* media: support multiple images via a simple carousel */}
      {((post.mediaFiles && post.mediaFiles.length) || post.imageUrl) && (
        <div className="post-media-wrapper">
          {(() => {
            const media =
              post.mediaFiles && post.mediaFiles.length
                ? post.mediaFiles
                : post.imageUrl
                  ? [{ url: post.imageUrl }]
                  : [];
            const current = media[activeMediaIndex] || media[0];
            const hasError = imageErrors.has(activeMediaIndex);
            return (
              <>
                {hasError ? (
                  <div className="post-media-error">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-grayed-out)"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p>Image unavailable</p>
                  </div>
                ) : (
                  <img
                    className="post-media"
                    src={current?.url}
                    alt={`post-media-${activeMediaIndex}`}
                    onError={() => handleImageError(activeMediaIndex)}
                  />
                )}

                {media.length > 1 && (
                  <>
                    <button
                      className="carousel-btn prev"
                      onClick={() =>
                        setActiveMediaIndex(
                          (i) => (i - 1 + media.length) % media.length
                        )
                      }
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      className="carousel-btn next"
                      onClick={() =>
                        setActiveMediaIndex((i) => (i + 1) % media.length)
                      }
                      aria-label="Next"
                    >
                      ›
                    </button>
                    <div className="carousel-dots">
                      {media.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${i === activeMediaIndex ? 'active' : ''}`}
                          onClick={() => setActiveMediaIndex(i)}
                          aria-label={`Show image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* text */}
      {post.text && <div className="post-body">{post.text}</div>}

      {/* actions */}
      <div className="post-actions">
        <LikeButton
          initialCount={post.likes}
          initiallyLiked={post.liked}
          persist={async () => {
            const base =
              (import.meta as any).env?.VITE_API_BASE ||
              'http://127.0.0.1:8080';
            const id = post.dbId || post.id;
            const token = AuthService.getToken();
            const res = await fetch(
              `${base}/posts/${encodeURIComponent(id)}/like`,
              {
                method: 'POST',
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              }
            );
            if (!res.ok) return;
            const body = await res.json().catch(() => ({}));
            return typeof body.noOfLikes === 'number'
              ? body.noOfLikes
              : undefined;
          }}
        />
        <button
          className="icon-btn"
          onClick={async () => {
            // Desired behavior: first click opens (collapsed view), second click immediately closes.
            if (!showComments) {
              setShowComments(true);
              setShowAllComments(false);
              // fetch comments if none available
              if (!comments || comments.length === 0) {
                setLoadingComments(true);
                try {
                  const base =
                    (import.meta as any).env?.VITE_API_BASE ||
                    'http://127.0.0.1:8080';
                  const id = post.dbId || post.id;
                  const resp = await fetch(
                    `${base}/public/posts/${encodeURIComponent(id)}/comments`
                  );
                  if (resp.ok) {
                    const data = await resp.json();
                    const mapped = Array.isArray(data)
                      ? data.map((c: any) => ({
                          id:
                            c.commentId ||
                            c._id ||
                            Math.random().toString(36).slice(2),
                          author:
                            c.authorName || (c.authorId ? 'Member' : 'Unknown'),
                          text: c.commentText || '',
                          likes: 0,
                        }))
                      : [];
                    if (mapped.length > 0) setComments(mapped);
                  }
                } catch (err) {
                  console.debug('fetch post comments failed', err);
                } finally {
                  setLoadingComments(false);
                }
              }
            } else {
              // if comments already open, immediately close everything
              setShowComments(false);
              setShowAllComments(false);
            }
          }}
          aria-expanded={showComments}
        >
          {/* comment bubble */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--comment)"
            strokeWidth="2"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 5V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
          <span>comments</span>
        </button>
        <button
          className="icon-btn"
          onClick={() => setShowShareModal(true)}
          aria-label="Share post"
        >
          {/* share icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>share</span>
        </button>
      </div>

      {/* Issue #108: Share modal */}
      {showShareModal && (
        <ShareModal
          type="post"
          itemId={post.dbId || post.id}
          onClose={() => setShowShareModal(false)}
          onShare={async () => {
            // TODO: Issue #109 - Implement POST /share/post endpoint
            // Show success toast (placeholder until endpoint exists)
            showSuccess('Post Shared!');
          }}
        />
      )}

      {/* comments */}
      {showComments && (
        <div className="comments">
          {loadingComments && (
            <div className="loading-comments">Loading comments...</div>
          )}
          {/* collapsed: show up to 3 comments by default; provide View more when >3 */}
          {!showAllComments ? (
            <>
              {comments.length > 0 ? (
                <>
                  {comments.slice(0, 3).map((c) => (
                    <CommentCard key={c.id} comment={c} />
                  ))}
                </>
              ) : (
                <div className="no-comments">No comments yet</div>
              )}

              {comments.length > 3 && (
                <button
                  className="link-btn"
                  onClick={async () => {
                    // fetch full comments then open expanded view
                    setLoadingComments(true);
                    try {
                      const base =
                        (import.meta as any).env?.VITE_API_BASE ||
                        'http://127.0.0.1:8080';
                      const id = post.dbId || post.id;
                      const resp = await fetch(
                        `${base}/public/posts/${encodeURIComponent(id)}/comments`
                      );
                      if (resp.ok) {
                        const data = await resp.json();
                        const mapped = Array.isArray(data)
                          ? data.map((c: any) => ({
                              id:
                                c.commentId ||
                                c._id ||
                                Math.random().toString(36).slice(2),
                              author:
                                c.authorName ||
                                (c.authorId ? 'Member' : 'Unknown'),
                              text: c.commentText || '',
                              likes: 0,
                            }))
                          : [];
                        setComments(mapped);
                      }
                    } catch (err) {
                      console.debug('fetch full comments failed', err);
                    } finally {
                      setLoadingComments(false);
                      setShowAllComments(true);
                    }
                  }}
                >{`View all ${comments.length} comments`}</button>
              )}
            </>
          ) : (
            <>
              {comments.length === 0 && (
                <div className="no-comments">No comments yet</div>
              )}
              {comments.length > 0 && (
                <>
                  {comments.map((c) => (
                    <CommentCard key={c.id} comment={c} />
                  ))}
                  {comments.length > 3 && (
                    <button
                      className="link-btn"
                      onClick={() => setShowAllComments(false)}
                    >
                      View less
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {/* comment composer (visible when comments opened) */}
          {showComments && (
            <form
              className="comment-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newComment.trim() || posting.current) return;
                posting.current = true;
                try {
                  const token = AuthService.getToken();
                  const base =
                    (import.meta as any).env?.VITE_API_BASE ||
                    'http://127.0.0.1:8080';
                  const postIdForApi = post.dbId || post.id;
                  const res = await fetch(
                    `${base}/posts/${encodeURIComponent(postIdForApi)}/comments`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ commentText: newComment }),
                    }
                  );
                  const body = await res.json().catch(() => ({}));
                  if (!res.ok)
                    throw new Error(body.error || 'Failed to post comment');
                  // prepend new comment to list
                  const created = body.comment;
                  // map server comment shape to client Comment
                  const mapped = {
                    id:
                      created.commentId ||
                      created._id ||
                      Math.random().toString(36).slice(2),
                    author:
                      created.authorName ||
                      (created.authorId ? 'Member' : 'Unknown'),
                    text: created.commentText || '',
                    likes: 0,
                  };
                  setComments((prev) => [mapped, ...prev]);
                  setNewComment('');
                } catch (err: any) {
                  console.error('Post comment failed', err);
                  alert(
                    err?.message || String(err) || 'Failed to post comment'
                  );
                } finally {
                  posting.current = false;
                }
              }}
            >
              <input
                className="comment-input"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn-next" type="submit">
                Post
              </button>
            </form>
          )}
        </div>
      )}

      {/* Toast notification */}
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    </article>
  );
}
