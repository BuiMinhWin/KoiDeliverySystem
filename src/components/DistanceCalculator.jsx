// import React, { useState } from 'react';

// const DistanceCalculator = () => {
//   const [distanceData, setDistanceData] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
  
//   const API_KEY = '8cm0ziapNh2rK7Wwlv4eZou3N4foyKV4Yq5TEIwM'; // Thay bằng API Key của bạn
//   const origins = '10.823099,106.629664';
//   const destinations = '21.028511,105.804817';

//   const fetchDistanceData = () => {
//     fetch(`https://rsapi.goong.io/distancematrix?origins=${origins}&destinations=${destinations}&vehicle=car&api_key=${API_KEY}`)
//       .then(response => response.json())
//       .then(data => {
//         setDistanceData(data);
//         setErrorMessage(null);
//       })
//       .catch(error => {
//         console.error('Error fetching distance matrix:', error);
//         setErrorMessage('Có lỗi xảy ra khi lấy dữ liệu.');
//       });
//   };

//   return (
//     <div>
//       <h1>Distance Calculator</h1>
//       <button onClick={fetchDistanceData}>Tính khoảng cách</button>

//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

//       {distanceData && (
//         <div>
//           <h2>Kết quả:</h2>
//           {distanceData.rows[0].elements.map((element, index) => (
//             <div key={index}>
//               <p><strong>Điểm đến {index + 1}:</strong></p>
//               <p>Khoảng cách: {element.distance.text}</p>
//               <p>Thời gian di chuyển: {element.duration.text}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DistanceCalculator;
