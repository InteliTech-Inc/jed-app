"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPhoneCall } from "@tabler/icons-react";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I create a new event?",
    answer:
      "To create a new event, navigate to the Events page from the sidebar and click on the 'Create New Event' button. Follow the multi-step form to provide essential details such as event name, description, tools needed (nominations, voting, ticketing), and pricing configuration.",
  },
  {
    question: "How does voting work?",
    answer:
      "Voting allows users to cast votes for nominees in your event. Each vote costs the amount you specify during event creation. Users can purchase multiple votes and distribute them among nominees. The system automatically tallies votes and displays real-time results.",
  },
  {
    question: "What is the service fee for?",
    answer:
      "The service fee (10% or 12%) covers platform maintenance, technical support, and payment processing costs. The 12% premium fee provides additional support for high-demand events, including priority support and enhanced analytics.",
  },
  {
    question: "Can I edit an event after creating it?",
    answer:
      "Yes, you can edit most aspects of your event after creation. Navigate to the Events page, select the event you wish to modify, and click the 'Edit' button. Note that some settings may be locked after the event has received nominations or votes.",
  },
  {
    question: "How do I manage nominees?",
    answer:
      "To manage nominees, go to the specific event and select the 'Nominations' tab. Here you can review, approve, reject, or edit nominations. You can also add nominees manually if needed. Each nominee can be assigned to categories that you define for your event.",
  },
  {
    question: "Is there a limit to how many events I can create?",
    answer:
      "There's no strict limit on the number of events you can create. However, we recommend managing a reasonable number of active events to ensure you can provide proper attention to each. Premium accounts may receive additional resources for managing multiple large-scale events.",
  },
  {
    question: "How can I view analytics for my event?",
    answer:
      "Analytics are available in the dashboard section. Select your event from the dropdown, and you'll see key metrics including vote counts, revenue generated, traffic sources, and user engagement statistics. You can export this data in various formats for further analysis.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support major credit cards (Visa, Mastercard, American Express), mobile payment options like Apple Pay and Google Pay, and select local payment methods depending on your region. Payment methods are securely processed through our payment partners.",
  },
];

export default function FaqsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Find answers to common questions about using our platform for events,
          nominations, and voting.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-neutral-700">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-lg p-6 text-center text-green-900">
          <h3 className="mb-2 text-xl font-semibold">
            Couldn't find what you're looking for?
          </h3>
          <p className="mb-4">
            Our support team is ready to assist with any additional questions.
          </p>
          <Button asChild>
            <Link href="/support/contact">
              Contact Support
              <IconPhoneCall className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
