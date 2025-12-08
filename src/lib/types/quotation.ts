export interface Quotation {
  // backend primary id for the quotation (UUID)
  id?: string;
  quotationNumber: string;
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
