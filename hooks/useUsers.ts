import { useQuery } from "@tanstack/react-query";

export interface Guarantor {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface UserData {
  id: string;

  username: string;
  email: string;
  phone: string;
  status: "Inactive" | "Pending" | "Blacklisted" | "Active";
  organization: string;
  dateJoined: string;
  timeJoined: string;

  userId: string;
  accountNumber: string;
  bankName: string;
  accountBalance: number;
  tier: 1 | 2 | 3;

  fullName: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;

  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncomeMin: number;
  monthlyIncomeMax: number;
  loanRepayment: number;

  twitter: string;
  facebook: string;
  instagram: string;

  hasLoan: boolean;
  hasSavings: boolean;

  guarantors: Guarantor[];
}

const fetchUsers = async (): Promise<UserData[]> => {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.status}`);
  }
  return res.json();
};

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });
}
