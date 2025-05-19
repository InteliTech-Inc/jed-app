"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useUser } from "@/hooks/use-user";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { Spinner } from "@/components/spinner";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePassword } = QUERY_FUNCTIONS;
  const { user } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      valid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: user?.email!,
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_new_password: formData.confirmPassword,
      };

      const { data } = await changePassword(payload);

      if (data) {
        toast.success("Password updated successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-500">{errors.currentPassword}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter your new password"
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      <Button type="submit" className="mt-4" disabled={isLoading}>
        {isLoading ? <Spinner /> : "Update Password"}
      </Button>
    </form>
  );
}
