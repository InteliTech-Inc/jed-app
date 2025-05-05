"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconBrandYoutube, IconExternalLink } from "@tabler/icons-react";

const tutorials = {
  gettingStarted: [
    {
      id: "gs1",
      title: "Creating Your First Event",
      description:
        "Learn how to create and set up your first event with nominations and voting.",
      videoId: "dQw4w9WgXcQ",
      duration: "4:12",
      date: "Jan 15, 2023",
    },
    {
      id: "gs2",
      title: "Setting Up Categories",
      description:
        "How to create and manage categories for nominations in your events.",
      videoId: "dQw4w9WgXcQ",
      duration: "3:45",
      date: "Jan 22, 2023",
    },
  ],
  nominations: [
    {
      id: "nom1",
      title: "Creating Nominations forms",
      description: "How to create nominations for your event.",
      videoId: "dQw4w9WgXcQ",
      duration: "6:18",
      date: "Feb 5, 2023",
    },
    {
      id: "nom2",
      title: "Viewing Nominations",
      description: "How to view nominations for your event.",
      videoId: "dQw4w9WgXcQ",
      duration: "4:55",
      date: "Feb 12, 2023",
    },
  ],
  voting: [
    {
      id: "vote2",
      title: "Real-time Voting Analytics",
      description:
        "How to view and interpret real-time voting statistics and analytics.",
      videoId: "dQw4w9WgXcQ",
      duration: "5:10",
      date: "Feb 26, 2023",
    },
  ],
};

// Video component with YouTube embed
function VideoTutorial({
  title,
  description,
  videoId,
  duration,
  date,
}: {
  title: string;
  description: string;
  videoId: string;
  duration: string;
  date: string;
}) {
  return (
    <Card className="overflow-hidden pt-0 shadow-none">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        ></iframe>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBrandYoutube className="text-red-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function TutorialsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Video Tutorials
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Learn how to use our platform with these step-by-step video guides.
          From basic setup to advanced features, we've got you covered.
        </p>
      </div>

      <Tabs defaultValue="gettingStarted" className="mx-auto max-w-5xl">
        <TabsList className="mb-8 grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="gettingStarted">Getting Started</TabsTrigger>
          <TabsTrigger value="nominations">Nominations</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
        </TabsList>

        <TabsContent value="gettingStarted" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.gettingStarted.map((tutorial) => (
              <VideoTutorial
                key={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                videoId={tutorial.videoId}
                duration={tutorial.duration}
                date={tutorial.date}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nominations" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.nominations.map((tutorial) => (
              <VideoTutorial
                key={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                videoId={tutorial.videoId}
                duration={tutorial.duration}
                date={tutorial.date}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="voting" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.voting.map((tutorial) => (
              <VideoTutorial
                key={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                videoId={tutorial.videoId}
                duration={tutorial.duration}
                date={tutorial.date}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mx-6 mt-16 rounded-lg bg-green-50 p-8 text-center">
        <h3 className="mb-3 text-xl font-semibold text-green-900">
          Need personalized help?
        </h3>
        <p className="mb-6 text-green-700">
          Our team offers one-on-one training sessions to help you get the most
          out of our platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href="/support/contact">
              Send us a message
              <IconExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/support/faqs">View FAQs</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
