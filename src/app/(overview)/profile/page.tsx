import React from "react";
import UserProfile from "./_components/user-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Profile",
    template: "%s | Event Management",
  },
  description: "Manage your account settings and profile information.",
};

export default function ProfilePage() {
  return <UserProfile />;
}
