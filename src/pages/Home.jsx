import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser, apiClient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/api/posts");
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Couldn't load blog posts right now.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreateClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const handleDelete = async (postId, postTitle) => {
    // double-checking before deleting
    if (window.confirm(`Really delete "${postTitle}"? This can"t be undone!`)) {
      try {
        await apiClient.delete(`/api/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        console.error("Delete failed:", error);
        setError("Something went wrong while deleting the post");
      }
    }
  };

  if (loading) return <div className="loading">Loading your blogs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <div className="posts-container">
        <div className="home-header">
          <h1>Welcome to the Developer Community</h1>
          <div className="home-content">
            <div className="feature-paragraphs">
              <p className="feature-paragraph">Where we share insights on the latest programming languages, tools and trends.</p>
              <p className="feature-paragraph">Learn from other developers by reading detailed blog posts.</p>
              <p className="feature-paragraph">Showcase our knowledge by writing and publishing technical articles.</p>
            </div>
          </div>
          
          <Link 
            to="/create" 
            className="create-post-btn"
            onClick={handleCreateClick}
          >
            create a blog
          </Link>
        </div>
        
        <div className="blog-section">
          <h2>Recent Posts</h2>
          {posts.length === 0 ? (
            <div className="no-posts">
              <h3>No posts yet!</h3>
              <p>Be the first to share something awesome with the community.</p>
              <Link 
                to="/create" 
                className="first-post-btn"
                onClick={handleCreateClick}
              >
                Write the First blog Post
              </Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="post-image" />
                  )}
                  <div className="post-content">
                    <h2 className="post-title">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h2>
                    {post.subtitle && <p className="post-subtitle">{post.subtitle}</p>}
                    <p className="post-excerpt">
                      {post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content}
                    </p>
                    <div className="post-meta">
                      <span className="post-author">by {post.author.username}</span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="post-view-section">
                      <Link to={`/post/${post._id}`} className="view-post-btn">
                        view full blog
                      </Link>
                    </div>
                    
                    {currentUser && currentUser.id === post.author._id && (
                      <div className="post-actions">
                        <Link to={`/edit/${post._id}`} className="edit-btn">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(post._id, post.title)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;