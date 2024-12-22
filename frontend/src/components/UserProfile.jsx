import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultProfileImage from "/assets/img_default_profile.png";

const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    profilePicture: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { profileDetails } = response.data;

        setProfile({
          firstName: profileDetails.firstName || "",
          lastName: profileDetails.lastName || "",
          phoneNumber: profileDetails.phoneNumber || "",
          address: profileDetails.address || "",
          city: profileDetails.city || "",
          province: profileDetails.province || "",
          postalCode: profileDetails.postalCode || "",
          profilePicture: profileDetails.profilePicture || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateProfile = useCallback(() => {
    const errors = {};
    if (!profile.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!profile.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!profile.phoneNumber || !/^\d{10}$/.test(profile.phoneNumber)) {
      errors.phoneNumber = "Phone Number must be a 10-digit number";
    }
    if (!profile.address) {
      errors.address = "Address is required";
    }
    if (!profile.city) {
      errors.city = "City is required";
    }
    if (!profile.province) {
      errors.province = "Province is required";
    }
    if (!profile.postalCode) {
      errors.postalCode = "Postal Code is required";
    }
    return errors;
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        {
          ...profile,
          profilePicture: profile.profilePicture,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProfile(response.data);
      alert("Profile updated successfully!");
      setIsEditing(false);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map((error) => error.message)
          .join(", ");
        setError(errorMessages);
      } else {
        setError("Failed to update profile");
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfile({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      profilePicture: "",
    });
  };

  const handleResetPassword = () => {
    navigate("/request-password-reset");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleUpdate}
        className="mb-4 bg-gray-400 border-gray p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl mb-4">User Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {Object.keys(validationErrors).map((key) => (
          <p key={key} className="text-red-500 mb-4">
            {validationErrors[key]}
          </p>
        ))}
        {isEditing ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            <div className="p-2 mb-4">
              {" "}
              <img
                src={profile.profilePicture || defaultProfileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />
            </div>
            <input
              type="text"
              placeholder="First Name"
              value={profile.firstName || ""}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="First Name"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={profile.lastName || ""}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="Last Name"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={profile.phoneNumber || ""}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="Phone Number"
            />
            <input
              type="text"
              placeholder="Address"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="Address"
            />
            <input
              type="text"
              placeholder="City"
              value={profile.city || ""}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="City"
            />
            <input
              type="text"
              placeholder="Province"
              value={profile.province || ""}
              onChange={(e) =>
                setProfile({ ...profile, province: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="Province"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={profile.postalCode || ""}
              onChange={(e) =>
                setProfile({ ...profile, postalCode: e.target.value })
              }
              className="border p-2 mb-4 w-full rounded-md placeholder-gray-400"
              aria-label="Postal Code"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 mb-4">
              {" "}
              <img
                src={profile.profilePicture || defaultProfileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full"
              />
            </div>
            <p className="mb-4">
              <strong>First Name:</strong> {profile.firstName || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Last Name:</strong> {profile.lastName || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Phone Number:</strong> {profile.phoneNumber || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Address:</strong> {profile.address || "N/A"}
            </p>
            <p className="mb-4">
              <strong>City:</strong> {profile.city || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Province:</strong> {profile.province || "N/A"}
            </p>
            <p className="mb-4">
              <strong>Postal Code:</strong> {profile.postalCode || "N/A"}
            </p>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Reset Password
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
