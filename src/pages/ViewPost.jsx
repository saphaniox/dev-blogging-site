import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./ViewPost.css";

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const { currentUser, apiClient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch {
        setError("Hmm, couldn't find that post. It might have been deleted.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    // Make sure user really wants to delete
    if (window.confirm("Are you sure? This can't be undone!")) {
      try {
        await apiClient.delete(`/api/posts/${id}`);
        navigate("/"); // go back home after deletion
      } catch {
        setError("Failed to delete the post. Please try again.");
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  const isAuthor = currentUser && currentUser.id === post.author._id;

  return (
    <div className="view-post">
      <article className="post">
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="post-header-image" />
        )}
        
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          {post.subtitle && <h2 className="post-subtitle">{post.subtitle}</h2>}
          
          <div className="post-meta">
            <span className="post-author">by {post.author.username}</span>
            <span className="post-date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {isAuthor && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="edit-btn">
              Edit Post
            </Link>
            <button onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </div>
        )}

        <div className="post-content">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default ViewPost;