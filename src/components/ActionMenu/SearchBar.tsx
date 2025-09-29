import { Search } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";

interface SearchBarProps {
  searchTerm: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ searchTerm, onChange }: SearchBarProps) => {
  return (
    <div className="bg-[#F3F5F7] py-2 rounded-[12px] dark:bg-[#0F1B29] px-4 flex justify-center items-center">
      <Search />
      <Input
        placeholder="Search leads"
        value={searchTerm}
        onChange={onChange}
        className="border-none shadow-none focus:outline-none h-12 min-w-md"
      />
    </div>
  );
};

export default SearchBar;
