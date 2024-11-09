// src/components/FAQs/FAQs.jsx
import React, { useState } from 'react';
import './FAQs.css'; // Import CSS riêng cho FAQs

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle cho câu hỏi
  };

  const faqs = [
    { question: "Chi phí để vận chuyển cá Koi của tôi là bao nhiêu?", 
      answer:"Chi phí vận chuyển sẽ phụ thuộc vào khoảng cách và số lượng cá Koi cần vận chuyển, vì vậy chúng tôi sẽ cần cung cấp cho bạn một báo giá cụ thể phù hợp với nhu cầu của bạn. Dịch vụ vận chuyển cá của chúng tôi sẽ cố gắng tư vấn và vận chuyển trong phạm vi ngân sách của bạn mà không ảnh hưởng đến sự an toàn và thoải mái của thú cưng. " },
    { question: "Có cần giấy tờ gì không khi vận chuyển cá Koi?",
       answer: "Bạn cần giấy tờ xác nhận nguồn gốc và sức khỏe của cá, cũng như các giấy tờ theo yêu cầu của địa phương hoặc quốc gia nhận." },
    { question: "Cá Koi có an toàn khi vận chuyển nước ngoài không?",
       answer: "Du lịch hàng không an toàn cho cá Koi cũng như an toàn cho con người. Đội ngũ nhân viên được đào tạo về vận chuyển cá Koi và sẽ chăm sóc, theo dõi cá Koi của bạn trong suốt hành trình. Và tất nhiên, chúng tôi sẽ lo liệu mọi thứ để đảm bảo chú cá của bạn có một chuyến đi vui vẻ và an toàn." },
    { question: "Cá Koi của tôi được vận chuyển ở đâu trên máy bay?",
       answer: "Cá Koi của bạn sẽ được vận chuyển trong một khoang hàng hóa đặc biệt bên trong máy bay. Khoang này vừa được kiểm soát khí hậu vừa được điều áp để đảm bảo sự an toàn và thoải mái cho cá của bạn, và nó nằm trên cùng một hệ thống lưu thông không khí như trong cabin." },
    { question: "Nếu cá Koi bị bệnh, tôi có thể vận chuyển không?",
       answer: "Không nên vận chuyển cá Koi bị bệnh. Hãy đảm bảo rằng cá của bạn hoàn toàn khỏe mạnh trước khi vận chuyển để tránh lây lan bệnh cho các cá khác." },
  ];

  return (
    <div className="faqs-section">
      <h2 className="faqs-title">FAQs</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            {faq.question}
            <span className={`arrow ${activeIndex === index ? 'open' : ''}`}>▼</span>
          </div>
          {activeIndex === index && (
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          )}
          <hr className="faq-divider" />
        </div>
      ))}
    </div>
  );
};

export default FAQs;
