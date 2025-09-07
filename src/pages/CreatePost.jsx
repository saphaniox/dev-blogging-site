import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, apiClient } = useAuth();
  const navigate = useNavigate();

  // redirect if not logged in
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("content", content);
      
      // only add image if one was selected
      if (image) {
        formData.append("image", image);
      }

      const response = await apiClient.post("/api/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // redirect to the new post
      navigate(`/post/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h1>Share Your Thoughts</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your post about?"
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
            placeholder="Add a short description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Cover Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Story *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            placeholder="Start writing your post here..."
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Publishing..." : "Publish Post"}
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreatePost;