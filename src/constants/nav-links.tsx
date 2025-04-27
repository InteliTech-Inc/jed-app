import { IconChartBar, IconLayoutDashboard, IconTicket, IconBrandParsinta, IconHelp, IconListDetails, IconPhoneCall } from "@tabler/icons-react";
export const MAIN_NAV_ITEMS = {
  user: {
    name: "Jed Events",
    email: "jed@jedevents.com",
    avatar: "/avatars/jed.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Events",
      url: "/events",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: IconTicket,
    },
  ],
  navSecondary: [
    {
      title: "Tutorials",
      url: "/support/tutorials",
      icon: IconBrandParsinta,
    },
    {
      title: "FAQs",
      url: "/support/faqs",
      icon: IconHelp,
    },
    {
      title: "Contact",
      url: "/support/contact",
      icon: IconPhoneCall,
    },
  ],
};
