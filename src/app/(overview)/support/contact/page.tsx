"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconBrandTwitter, IconMail, IconPhone } from "@tabler/icons-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      topic: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        topic: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Contact Us
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Have questions or need assistance? We're here to help. Reach out to
          our team and we'll get back to you soon.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Here are the ways you can reach our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <IconMail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">support@jedapp.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <IconPhone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">+233 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <IconBrandTwitter className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Twitter</p>
                  <p className="font-medium">@JedApp</p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-blue-50 p-4 text-blue-700">
                <h4 className="mb-2 font-semibold">Business Hours</h4>
                <p className="text-sm">Monday - Friday: 8am - 6pm GMT</p>
                <p className="text-sm">Saturday: 10am - 4pm GMT</p>
                <p className="text-sm">Sunday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="rounded-lg bg-green-50 p-6 text-center text-green-700">
                  <h3 className="mb-2 text-xl font-semibold">
                    Message Sent Successfully!
                  </h3>
                  <p>
                    Thank you for reaching out. We'll respond to your inquiry
                    within 24-48 hours.
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={formState.topic}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing & Payments
                        </SelectItem>
                        <SelectItem value="feedback">
                          Feedback & Suggestions
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
