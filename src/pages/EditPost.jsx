import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./CreatePost.css";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const { currentUser, apiClient } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/api/posts/${id}`);
        const post = response.data;
        
        // Check ownership
        if (currentUser.id !== post.author._id) {
          navigate("/"); 
          return;
        }
        
       
        setTitle(post.title);
        setSubtitle(post.subtitle || "");
        setContent(post.content);
        setCurrentImage(post.imageUrl || "");
        setFetchLoading(false);
      } catch {
        setError("Post not found");
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      
      // Only include image 
      if (image) {
        formData.append("image", image);
      }

      await apiClient.put(`/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/post/${id}`); 
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update the post");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading">Loading blog post...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="create-post">
      <h1>Edit Your Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle (optional)</label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Update Cover Image (optional)</label>
          {currentImage && (
            <div className="current-image">
              <img src={currentImage} alt="Current cover" style={{ maxWidth: "200px" }} />
              <p>Current image</p>
            </div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Saving changes..." : "Update Post"}
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default EditPost;