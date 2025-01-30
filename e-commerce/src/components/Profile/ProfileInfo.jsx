import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiUser, FiMail, FiCalendar, FiEdit } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileInformation = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfileData();
  }, [user, token]);

  const handleImageError = () => setImageError(true);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-900/20 rounded-xl text-red-400 flex items-center gap-3">
        <FiUser className="flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-gray-800 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* Profile Image */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-gray-700 overflow-hidden shadow-lg">
            {loading ? (
              <Skeleton circle height={128} width={128} />
            ) : imageError ? (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <FiUser className="text-4xl text-gray-400" />
              </div>
            ) : (
              <img
                src={`http://localhost:3000/uploads/${profileData?.photo || "default-profile.jpg"}`}
                alt="Profile"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={handleImageError}
              />
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors">
            <FiEdit className="text-white" />
          </button>
        </div>

        {/* Profile Details */}
        <div className="flex-1 w-full md:w-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center md:text-left">
            {loading ? <Skeleton width={200} /> : profileData?.name}
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <FiMail className="flex-shrink-0" />
              {loading ? (
                <Skeleton width={180} />
              ) : (
                <span className="truncate">{profileData?.email}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <FiCalendar className="flex-shrink-0" />
              {loading ? (
                <Skeleton width={150} />
              ) : (
                <span>
                  {profileData?.dob
                    ? new Date(profileData.dob).toLocaleDateString("en-GB")
                    : "Date of birth not set"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
        <InfoItem label="Account Created" value={new Date(user?.createdAt).toLocaleDateString()} />
        <InfoItem label="Last Updated" value={profileData?.updatedAt 
          ? new Date(profileData.updatedAt).toLocaleDateString()
          : "N/A"} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-sm text-gray-400">{label}</span>
    <p className="font-medium text-white">{value}</p>
  </div>
);

export default ProfileInformation;