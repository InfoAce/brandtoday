export default [
  {
    icon: "bar-chart",
    name: "Overview",
    to:   "Overview"
  },
  {
    name: "Data Management",
    icon: "box",
    children: [
      {
        icon: "users",
        name: "Clients",
        to:   "Clients"
      },
      {
        icon: "user-plus",
        name: "Staff",
        to:   "Staff"
      },
      {
        icon: "archive",
        name: "Orders",
        to:   "Orders"
      },
    ]
  },
  {
    icon: "home",
    name: "Website",
    // children: [
    //   {
    //     icon: "home",
    //     name: "Home",
    //     to:   "WebsiteHome"
    //   },
    //   {
    //     icon: "home",
    //     name: "Services",
    //     to:   "WebsiteHome"
    //   },
    //   {
    //     icon: "home",
    //     name: "Policies",
    //     to:   "WebsiteHome"
    //   },
    //   {
    //     icon: "home",
    //     name: "Contact Us",
    //     to:   "WebsiteHome"
    //   },
    //   {
    //     icon: "home",
    //     name: "Services",
    //     to:   "WebsiteHome"
    //   },
    // ]
  },
  {
    icon: "settings",
    name: "Settings",
    children: [
      {
        icon: "user",
        name: "Profile",
        to:   "Profile"
      },
      {
        icon: "chrome",
        name: "Company",
        to:   "Company"
      },
      {
        icon: "lock",
        name: "System",
        to:   "System"
      }
    ]
  }
]
  