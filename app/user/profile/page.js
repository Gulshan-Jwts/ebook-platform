"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import "@/stylesheets/profile.css";
import { useData } from "@/components/DataContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session && status !== "loading") {
    router.push("/user/login");
  }

  const { dbUser } = useData();

  const [user, setUser] = useState({
    userID: "Your ID",
    image: null,
    name: "User Name",
  });

  useEffect(() => {
    const user = session?.user;
    console.log(dbUser, "data");
    if (user && dbUser) {
      setUser({
        image: user.image,
        name: dbUser.firstName || "",
        userID: dbUser.username,
      });
    }
  }, [status, dbUser,session?.user]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    userID: user.userID,
  });

  useEffect(() => {
    setFormData({ name: user.name, userID: user.userID });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userID,
          username: formData.name,
        }),
      });

      if (response.ok) {
        setUser((prev) => ({
          ...prev,
          userID: formData.userID,
          name: formData.name,
        }));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      setFormData({
        name: user.name,
        username: user.username,
      });
    }
  };

  return (
    <>
      <div className="profile-card">
        <Image width={100} height={100} src={user.image} alt="Profile Picture" className="profile-pic" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="label">
              User ID
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.userID}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`input ${isEditing ? "" : "disabled"}`}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`input ${isEditing ? "" : "disabled"}`}
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              onClick={handleEditToggle}
              className="button edit-button"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <button type="submit" className="button save-button">
                Update
              </button>
            )}
          </div>
        </form>
      </div>
        {!isEditing && (
          <div className="button-group">
            <button
              onClick={() => {
                const sure = confirm("Are you sure you want to logout?\nyou can definentely read your books later");
                if (sure){
                  signOut({ callbackUrl: '/' })
                }
              }}
              className="button logout-button"
            >
              logout
            </button>
          </div>
        )}
    </>
  );
};

export default Page;
