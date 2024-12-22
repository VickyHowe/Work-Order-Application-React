import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const UserProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
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
  
        // Accessing profileDetails from the response
        const { profileDetails } = response.data;
  
        // Set the profile state with the fetched profile details
        setProfile({
          firstName: profileDetails.firstName || "",
          lastName: profileDetails.lastName || "",
          phoneNumber: profileDetails.phoneNumber || "",
          address: profileDetails.address || "",
          city: profileDetails.city || "",
          province: profileDetails.province || "",
          postalCode: profileDetails.postalCode || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
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
        profile,
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
    // Optionally reset the form fields to the original values fetched from the API
    setProfile({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-4">User  Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {Object.keys(validationErrors).map((key) => (
        <p key={key} className="text-red-500 mb-4">
          {validationErrors[key]}
        </p>
      ))}
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="First Name"
            value={profile.firstName || ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="First Name"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={profile.lastName || ""}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="Last Name"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={profile.phoneNumber || ""}
            onChange={(e) =>
              setProfile({ ...profile, phoneNumber: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="Phone Number"
          />
          <input
            type="text"
            placeholder="Address"
            value={profile.address || ""}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="Address"
          />
          <input
            type="text"
            placeholder="City"
            value={profile.city || ""}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            className="border p-2 mb-4 w-full"
            aria-label="City"
          />
          <input
            type="text"
            placeholder="Province"
            value={profile.province || ""}
            onChange={(e) =>
              setProfile({ ...profile, province: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="Province"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={profile.postalCode || ""}
            onChange={(e) =>
              setProfile({ ...profile, postalCode: e.target.value })
            }
            className="border p-2 mb-4 w-full"
            aria-label="Postal Code"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white p-2 ml-4"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>
  <strong>User:</strong> {user.username} {/* Added this line to display the user's username */}
</p>
          <p>
            <strong>First Name:</strong> {profile.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {profile.lastName}
          </p>
          <p>
            <strong>Phone Number:</strong> {profile.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
          <p>
            <strong>City:</strong> {profile.city}
          </p>
          <p>
            <strong>Province:</strong> {profile.province}
          </p>
          <p>
            <strong>Postal Code:</strong> {profile.postalCode}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white p-2 mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );

};

export default UserProfile;