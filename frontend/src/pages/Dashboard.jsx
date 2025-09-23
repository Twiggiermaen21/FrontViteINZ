import React, { useState } from "react";

const Dashboard = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={image}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
