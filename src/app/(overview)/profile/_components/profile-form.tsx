"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { getUserFromToken } from "@/helpers/get-token";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onProfileUpdate?: (data: ProfileData) => void;
}

export function ProfileForm({
  initialData,
  onProfileUpdate,
}: Readonly<ProfileFormProps>) {
  const [formData, setFormData] = useState<ProfileData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { updateUser } = QUERY_FUNCTIONS;
  const user = getUserFromToken();
  const { mutateAsync: updateExistingUser, isPending } = useMutation({
    mutationKey: [QUERY_KEYS.USER],
    mutationFn: async (payload: { data: any; id: string }) => {
      return updateUser(payload.data, payload.id);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError) => {
      if (error instanceof Error) {
        toast.error(formatJedError(error));
      } else {
        toast.error("An error occurred while updating the profile.");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onProfileUpdate?.(formData);

    const nameParts = formData.name.trim().split(" ");
    const payload = {
      first_name: nameParts[0],
      last_name: nameParts.slice(1).join(" ") || "",
      email: formData.email,
      phone_number: formData.phone,
      company: formData.company,
      role: formData.role,
    };

    await updateExistingUser({ data: payload, id: user?.sub! });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            readOnly
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company/Organization</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Enter your role"
          readOnly
          disabled
        />
      </div>
      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? <Spinner /> : "Save Changes"}
      </Button>
    </form>
  );
}
