import React from 'react';
import safe from '../../assets/safe.jpg'
import './Blog.css'; // Import file CSS

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: 'How to Transport Koi Fish Safely',
      author: 'John Doe',
      date: 'October 10, 2024',
      content: 'Transporting Koi fish requires careful attention to water quality, temperature, and stress management to ensure the fish arrive safely at their destination.',
      imageUrl: 'https://example.com/koi-transport.jpg',
    },
    {
      id: 2,
      title: '5 Tips for Keeping Your Koi Pond Clean',
      author: 'Jane Smith',
      date: 'September 25, 2024',
      content: 'Maintaining a clean koi pond is crucial for the health and longevity of your fish. Regular water testing and proper filtration can make a huge difference.',
      imageUrl: 'https://example.com/koi-pond.jpg',
    },
    // Add more blog posts here...
  ];

  return (
    <div className="blog-container">
      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card">
          <img src={safe} alt={blog.title} className="blog-image" />  
          <div className="blog-content">
            <h2 className="blog-title">{blog.title}</h2>
            <p className="blog-author-date">By {blog.author} on {blog.date}</p>
            <p className="blog-text">{blog.content}</p>
            <button className="read-more">Read More</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
