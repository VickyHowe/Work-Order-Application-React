import React from 'react';

const UserProfile = ({ user }) => {
    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">User  Profile</h2>
            <p className="mb-2">User  ID: {user.id}</p>
            <p className="mb-2">Username: {user.username}</p>
        </div>
    );
};

export default UserProfile;