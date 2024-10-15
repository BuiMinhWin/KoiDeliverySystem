import React, { useState, useEffect } from 'react';
import { getFeedbacks, replyFeedback } from '../../services/SaleStaffService';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    getFeedbacks()
      .then((response) => {
        setFeedbacks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
      });
  }, []);

  const handleReply = (feedbackId) => {
    replyFeedback(feedbackId, replyContent)
      .then(() => {
        console.log('Replied successfully');
      })
      .catch((error) => {
        console.error("Error replying to feedback:", error);
      });
  };

  return (
    <div className="feedback-page">
      <h2>Feedback</h2>
      <ul className="list-group">
        {feedbacks.map((feedback) => (
          <li key={feedback.id} className="list-group-item">
            <p>{feedback.content}</p>
            <button onClick={() => setSelectedFeedback(feedback)}>Reply</button>
          </li>
        ))}
      </ul>

      {selectedFeedback && (
        <div className="reply-section">
          <h3>Reply to: {selectedFeedback.content}</h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows="4"
            cols="50"
          />
          <button onClick={() => handleReply(selectedFeedback.id)}>Send Reply</button>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
