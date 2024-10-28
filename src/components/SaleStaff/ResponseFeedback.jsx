import React, { useState, useEffect } from 'react';
import { getAllFeedbackByOrderId, respondToFeedback } from '../../services/ResponseFeedback';
import { useParams } from 'react-router-dom';
import './ResponseFeedback.css';

const FeedbackResponse = () => {
    const { orderId } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [responses, setResponses] = useState({}); // Manage responses by feedbackId

    useEffect(() => {
        if (orderId) {
            getAllFeedbackByOrderId(orderId)
                .then((response) => {
                    if (Array.isArray(response)) {
                        setFeedbacks(response);
                    } else {
                        console.error("Unexpected response format:", response);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching feedbacks:", error);
                });
        } else {
            console.log("Order ID not found");
        }
    }, [orderId]);

    const handleInputChange = (feedbackId, value) => {
        setResponses(prevResponses => ({
            ...prevResponses,
            [feedbackId]: value
        }));
    };

    const handleResponseSubmit = async (feedbackId) => {
        try {
            const accountId = localStorage.getItem("accountId"); // Get accountId from local storage
            const payload = {
                comment: responses[feedbackId],
                accountId: accountId,
            };
    
            await respondToFeedback(feedbackId, payload);
            setResponses(prevResponses => ({
                ...prevResponses,
                [feedbackId]: "" // Clear the specific response text after submission
            }));
            alert("Phản hồi đã được gửi thành công!");
        } catch (error) {
            console.error("Error responding to feedback:", error);
            alert("Có lỗi xảy ra khi gửi phản hồi.");
        }
    };

    return (
        <div className="feedback-response-container">
            <h2>Customer Feedbacks</h2>
            {feedbacks.length > 0 ? (
                feedbacks.map(feedback => (
                    <div key={feedback.feedbackId} className="feedback-item">
                        <p><strong>Rating:</strong> {feedback.rating}</p>
                        <p><strong>Comment:</strong> {feedback.comment}</p>
                        <div>
                            <label>Phản hồi của Sale:</label>
                            <input
                                type="text"
                                value={responses[feedback.feedbackId] || ""}
                                onChange={(e) => handleInputChange(feedback.feedbackId, e.target.value)}
                                placeholder="Điền phản hồi của bạn..."
                            />
                            <button onClick={() => handleResponseSubmit(feedback.feedbackId)}>
                                Gửi Phản Hồi
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No feedback available for this order.</p>
            )}
        </div>
    );
};

export default FeedbackResponse;
