import {
  IconLayoutDashboard,
  IconTicket,
  IconBrandParsinta,
  IconHelp,
  IconListDetails,
  IconPhoneCall,
  IconWallet,
} from "@tabler/icons-react";
export const MAIN_NAV_ITEMS = {
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
      title: "Withdrawals",
      url: "/withdrawals",
      icon: IconWallet,
    },
    // {
    //   title: "Tickets",
    //   url: "/tickets",
    //   icon: IconTicket,
    //   badge: "soon",
    // },
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
