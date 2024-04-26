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
    to:   "Website"
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
  