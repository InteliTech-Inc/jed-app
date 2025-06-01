"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { AvatarUpload } from "./avatar-upload";

import { useUser } from "@/hooks/use-user";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("general");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "JED Events",
    role: "",
    media: {
      url: "",
    },
  });
  const [avatar, setAvatar] = useState("/avatars/jed.png");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user?.first_name} ${user?.last_name}`,
        email: user?.email,
        phone: user?.phone_number!,
        company: user?.organization!,
        role: user?.role!,
        media: {
          url: user?.media?.url ?? "",
        },
      });
      setAvatar(user.media?.url ?? "/avatars/jed.png");
    }
  }, [user]);

  const handleProfileUpdate = (data: typeof profileData) => {
    setProfileData(data);
  };

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar || "/avatars/jed.png");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Account Settings</h1>

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
            <Card className="shadow-none lg:col-span-4">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  initialData={profileData}
                  onProfileUpdate={handleProfileUpdate}
                />
              </CardContent>
            </Card>

            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Update your profile picture.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <AvatarUpload
                  currentAvatar={avatar}
                  userName={profileData.name}
                  onAvatarChange={handleAvatarChange}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
