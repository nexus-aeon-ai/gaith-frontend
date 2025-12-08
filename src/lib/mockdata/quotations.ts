import { Quotation } from "../types";

export const mockQuotations: Quotation[] = [
  {
    quotationNumber: "QUO-2024-001",
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: "Michael Anderson",
      email: "anderson@email.com",
    },
    amount: 2500,
    status: "completed",
    createdDate: "2025-07-01",
    validUntil: {
      date: "2025-07-15",
      text: "6 days left",
    },
  },
  {
    quotationNumber: "QUO-2024-002",
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: "Sarah Johnson",
      email: "sarah@email.com",
    },
    amount: 4800,
    status: "pending",
    createdDate: "2025-07-03",
    validUntil: {
      date: "2025-07-18",
      text: "9 days left",
    },
  },
  {
    quotationNumber: "QUO-2024-003",
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: "Alice Williams",
      email: "alice@email.com",
    },
    amount: 1800,
    status: "draft",
    createdDate: "2025-07-05",
    validUntil: {
      date: "2025-07-20",
      text: "11 days left",
    },
  },
  {
    quotationNumber: "QUO-2024-004",
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: "Steve Smith",
      email: "steve@email.com",
    },
    amount: 3500,
    status: "rejected",
    createdDate: "2025-07-07",
    validUntil: {
      date: "2025-07-21",
      text: "12 days left",
    },
  },
  {
    quotationNumber: "QUO-2024-005",
    customer: {
      avatar: "/images/girl-avatar.jpg",
      name: "Emily Brown",
      email: "emily@email.com",
    },
    amount: 5200,
    status: "completed",
    createdDate: "2025-07-09",
    validUntil: {
      date: "2025-07-25",
      text: "16 days left",
    },
  },
];
