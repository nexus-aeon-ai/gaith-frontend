export interface IProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  languagePreference: string;
  profilePic: string | null;
  createdAt: string;
  updatedAt: string;
  systemSettings: {
    key: string;
    value: string;
    category: string;
  }[];
  permissions: string[];
}
