import React, { useEffect, useState } from 'react';

function ViewProfile({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/business/profile/${userId}`)
      .then(res => res.json())
      .then(result => {
        if(result.success) setData(result.business);
      });
  }, [userId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="view-profile-container">
      <h2>{data.name}</h2>
      <p><strong>Year Established:</strong> {data.yearEstablished}</p>
      <p><strong>About:</strong> {data.about}</p>
      <p><strong>Address:</strong> {data.address}</p>
      <p><strong>Recommended Items:</strong> {data.recommendedItems?.join(', ')}</p>
      {data.foodHygieneCertUrl && (
        <div>
          <a href={data.foodHygieneCertUrl} target="_blank" rel="noopener noreferrer">
            View Hygiene Certificate
          </a>
        </div>
      )}
    </div>
  );
}

export default ViewProfile;