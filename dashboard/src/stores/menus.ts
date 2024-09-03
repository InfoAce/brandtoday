export default [
  {
    icon: "fa fa-bar-chart",
    name: "Overview",
    to:   "Overview"
  },
  {
    name: "Data Management",
    icon: "box",
    children: [
      {
        icon: "fa fa-users",
        name: "Clients",
        to:   "Clients"
      },
      {
        icon: "fa fa-users-line",
        name: "Categories",
        to:   "Categories"
      },
      {
        icon: "fa fa-user-plus",
        name: "Staff",
        to:   "Staff"
      },
      {
        icon: "fa fa-box",
        name: "Orders",
        to:   "Orders"
      },
    ]
  },
  {
    icon: "fa fa-globe",
    name: "Website",
    to:   "Website"
  },
  {
    icon: "settings",
    name: "Settings",
    children: [
      {
        icon: "fa fa-user",
        name: "Profile",
        to:   "Profile"
      },
      {
        icon: "fa fa-building",
        name: "Company",
        to:   "Company"
      },
      {
        icon: "fa fa-cog",
        name: "System",
        to:   "System"
      }
    ]
  }
]
  