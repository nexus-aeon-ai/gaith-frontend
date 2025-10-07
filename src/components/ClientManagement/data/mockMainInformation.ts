import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export const mockMainInformationData = {
  agreementPeriod: {
    from: "Jul 5, 2025",
    to: "Jul 5, 2025",
    status: "Active",
    renewalDue: "In 8 Months",
    assignedTo: [
      { name: "Alice", initial: "A", color: "bg-pink-500" },
      { name: "Sarah", initial: "S", color: "bg-orange-500" },
      { name: "Steve", initial: "S", color: "bg-blue-500" },
      { name: "Team", initial: "T", color: "bg-green-500" },
    ],
  },
  businessOverview: {
    description: "Global Solutions Inc. is a leading technology company specializing in enterprise software solutions and digital transformation services for Fortune 500 companies.",
    founded: "2010",
    employees: "1,200+",
    headquarters: "AED",
  },
  socialMedia: {
    accounts: [
      { name: "LinkedIn", icon: FaLinkedin, color: "bg-[#3072C014] text-[#3072C0]" },
      { name: "X", icon: FaXTwitter, color: "bg-[#07091314] text-[#070913]" },
      { name: "Instagram", icon: FaInstagram, color: "bg-[#EE4F8D14] text-[#EE4F8D]" },
      { name: "Facebook", icon: FaFacebook, color: "bg-[#3072C014] text-[#3072C0]" },
    ],
    contact: {
      email: "contact@globalsolutions.com",
      phone: "+9670000000000",
      website: "www.globalsolutions.com",
    },
  },
  locationDetails: {
    primaryRegion: "UAE",
    secondaryRegions: "(MENA)",
    targetMarkets: "Enterprise, Mid-Market Businesses",
  },
  visionMission: {
    vision: "To be the global leader in innovative technology solutions that empower businesses to achieve digital excellence and sustainable growth.",
    mission: "We deliver cutting-edge technology solutions that solve complex business challenges, drive efficiency, and create lasting value for our clients and stakeholders.",
  },
  assignedTo: [
    { name: "Michael Anderson", initial: "MA", color: "bg-blue-500", role: "Account manager" },
    { name: "James Brown", initial: "JB", color: "bg-orange-500", role: "Data Analyst" },
    { name: "Michael Anderson", initial: "MA", color: "bg-green-500", role: "Social media" },
    { name: "Emily Williams", initial: "EW", color: "bg-purple-500", role: "UX Researcher" },
    { name: "Sophia Patel", initial: "SP", color: "bg-pink-500", role: "Head of Operations" },
  ],
};
