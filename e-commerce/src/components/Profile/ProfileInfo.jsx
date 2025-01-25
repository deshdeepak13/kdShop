import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const ProfileInformation = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the request headers for authorization
            },
          }
        );
        setProfileData(response.data); // Set the fetched profile data
        // console.log(response.data.photo)
      } catch (err) {
        setError("Failed to fetch profile data.");
        // console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchProfileData();
    }
  }, [user, token]);

  if (loading) {
    return <div className="text-center text-white p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Profile Information</h2>
      {profileData && (
        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex justify-center">
            <img
              src={`http://localhost:3000/uploads/${
                profileData.photo || "default-profile.jpg"
              }`} // Dynamically display profile image
              // src={`http://localhost:3000/uploads/1735298152425-IMG_20220305_072550.png`} //
              alt="Profile"
              className="rounded-full border-4 border-gray-200 shadow-lg w-32 h-32"
            />
          </div>

          {/* Name Section */}
          <div className="flex justify-between">
            <strong className="text-lg">Name:</strong>
            <span className="text-gray-300">{profileData.name}</span>
          </div>

          {/* Email Section */}
          <div className="flex justify-between">
            <strong className="text-lg">Email:</strong>
            <span className="text-gray-300">{profileData.email}</span>
          </div>

          {/* DOB Section */}
          <div className="flex justify-between">
            <strong className="text-lg">Date of Birth:</strong>
            <span className="text-gray-300">
              {profileData.dob
                ? new Date(profileData.dob).toLocaleDateString("en-GB") // en-GB format is DD/MM/YYYY
                : "Not Provided"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInformation;
