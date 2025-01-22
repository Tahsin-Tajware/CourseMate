import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosPrivate from "../api/axiosPrivate";
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data when the component is mounted
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.post("/me", {});
        setUserData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized! Please log in again.");
        } else {
          setError("Failed to fetch profile data.");
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Your Profile</h2>
        {userData ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-700">
                <strong>Name:</strong> {userData.name}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          </div>
        ) : (
          !error && <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
