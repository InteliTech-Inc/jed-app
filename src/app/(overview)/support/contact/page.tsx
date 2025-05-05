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
import Link from "next/link";
import { Spinner } from "@/components/spinner";
export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

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
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
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
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Here are the ways you can reach our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center">
                <div className="bg-accent mr-4 flex h-10 w-10 items-center justify-center rounded-full">
                  <IconMail className="text-secondary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">support@jedapp.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-accent mr-4 flex h-10 w-10 items-center justify-center rounded-full">
                  <IconPhone className="text-secondary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">+233 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-accent mr-4 flex h-10 w-10 items-center justify-center rounded-full">
                  <IconBrandTwitter className="text-secondary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Twitter</p>
                  <p className="font-medium">@JedApp</p>
                </div>
              </div>

              <div className="mt-8 rounded-lg bg-stone-50 p-4 text-stone-700">
                <h4 className="mb-2 font-semibold">Business Hours</h4>
                <p className="text-sm">Monday - Friday: 8am - 6pm GMT</p>
                <p className="text-sm">Saturday: 10am - 4pm GMT</p>
                <p className="text-sm">Sunday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "success" ? (
                <div className="rounded-lg bg-green-50 p-6 text-center text-green-700">
                  <h3 className="mb-2 text-xl font-semibold">
                    Message Sent Successfully!
                  </h3>
                  <p className="my-4">
                    Thank you for reaching out. We'll respond to your inquiry
                    within 24-48 hours.
                  </p>
                  <Button
                    onClick={() => setStatus("idle")}
                    variant="secondary"
                    asChild
                  >
                    <Link href="/support/contact">Send Another Message</Link>
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

                  <div className="w-full space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select
                      value={formState.topic}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger className="w-full">
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
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? <Spinner /> : "Send Message"}
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
