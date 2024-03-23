export default [
  {
    icon: "home",
    name: "Overview",
    to:   "Overview"
  },
  {
    name: "Data Management",
    icon: "home",
    children: [
      {
        icon: "fa fa-speedometer",
        name: "Clients",
        to:   "Clients"
      },
      {
        icon: "fa fa-speedometer",
        name: "Staff",
        to:   "Staff"
      },
      {
        icon: "fa fa-speedometer",
        name: "Orders",
        to:   "Orders"
      },
    ]
  },
  {
    icon: "home",
    name: "Website",
    children: [
      {
        icon: "fa fa-speedometer",
        name: "Home",
        to:   "WebsiteHome"
      },
    ]
  },
  {
    icon: "settings",
    name: "Settings",
    children: [
      {
        icon: "fa fa-speedometer",
        name: "Profile",
        to:   "Profile"
      },
      {
        icon: "fa fa-speedometer",
        name: "Company",
        to:   "Company"
      },
      {
        icon: "fa fa-speedometer",
        name: "System",
        to:   "System"
      }
    ]
  }
]
  