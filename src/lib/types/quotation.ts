export interface Quotation {
  quotationId: string;
  customer: {
    avatar: string;
    name: string;
    email: string;
  };
  amount: number;
  status: "completed" | "draft" | "pending" | "rejected";
  createdDate: string;
  validUntil: {
    date: string;
    text: string;
  };
}