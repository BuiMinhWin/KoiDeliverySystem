import React, { useState, useEffect } from 'react';
import { getAllFeedbackByOrderId, respondToFeedback } from '../../services/ResponseFeedback';
import { useParams } from 'react-router-dom';
import './ResponseFeedback.css';
import { colors } from '@mui/material';

const FeedbackResponse = () => {
    const { orderId } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [responses, setResponses] = useState({}); 

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getAllFeedbackByOrderId(orderId);
                console.log("Fetched Feedbacks:", data);
                setFeedbacks(data); 
            } catch (error) {
                console.error("Error:", error);
            }
        };
    
        fetchFeedbacks();
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
            setFeedbacks(prevFeedbacks =>
                prevFeedbacks.map(fb =>
                    fb.feedbackId === feedbackId ? { ...fb, response: responses[feedbackId] } : fb
                )
            );
            setResponses(prevResponses => ({
                ...prevResponses,
                [feedbackId]: "" 
            }));
            alert("Phản hồi đã được gửi thành công!");
        } catch (error) {
            console.error("Error responding to feedback:", error);
            alert("Có lỗi xảy ra khi gửi phản hồi.");
        }
    };

    return (
        <div className="feedback-response-container" >
            <h2>Feedback của khách hàng</h2>
            {feedbacks.length > 0 ? (
                feedbacks.map(feedback => (
                    <div key={feedback.feedbackId} className="feedback-item">
                        <p><strong>Xếp hạng:</strong> {feedback.rating}</p>
                        <p><strong>Bình luận:</strong> {feedback.comment}</p>
                        <div>
                        <p><strong>Phản hồi của Sale Staff: </strong></p>
                        {feedback.responses ? (
                            <p>{feedback.responses.comment}</p>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={responses[feedback.feedbackId] || ""}
                                    onChange={(e) => handleInputChange(feedback.feedbackId, e.target.value)}
                                    placeholder="Điền phản hồi của bạn..."
                                />
                                <button onClick={() => handleResponseSubmit(feedback.feedbackId)}>
                                    Gửi Phản Hồi
                                </button>
                            </>
                        )}
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
