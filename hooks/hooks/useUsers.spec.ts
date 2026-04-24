import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useUsers, type UserData } from "@/hooks/useUsers";

const mockUser: UserData = {
  id: "user-1",
  username: "ada.lovelace",
  email: "ada@lendsqr.com",
  phone: "08000000001",
  status: "Active",
  organization: "Lendsqr",
  dateJoined: "2024-01-15",
  timeJoined: "10:30 AM",
  userId: "UID-001",
  accountNumber: "1234567890",
  bankName: "Test Bank",
  accountBalance: 50000,
  tier: 1,
  fullName: "Ada Lovelace",
  bvn: "12345678901",
  gender: "Female",
  maritalStatus: "Single",
  children: "None",
  typeOfResidence: "Parent's Apartment",
  levelOfEducation: "B.Sc",
  employmentStatus: "Employed",
  sectorOfEmployment: "FinTech",
  durationOfEmployment: "2 years",
  officeEmail: "ada@work.com",
  monthlyIncomeMin: 100000,
  monthlyIncomeMax: 200000,
  loanRepayment: 15000,
  twitter: "@ada",
  facebook: "ada.fb",
  instagram: "@ada.ig",
  hasLoan: false,
  hasSavings: true,
  guarantors: [
    {
      fullName: "Charles Babbage",
      phone: "08000000002",
      email: "charles@lendsqr.com",
      relationship: "Colleague",
    },
  ],
};

/** Fresh QueryClient  prevents cache bleed between tests */
import { createElement } from "react";

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  jest.resetAllMocks();
});

// Tests

describe("useUsers", () => {
  // +
  test("returns users on a successful fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    } as Response);

    const { result } = renderHook(() => useUsers(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].id).toBe("user-1");
    expect(result.current.data![0].email).toBe("ada@lendsqr.com");
    expect(fetch).toHaveBeenCalledWith("/api/users");
  });

  test("returns multiple users", async () => {
    const secondUser: UserData = {
      ...mockUser,
      id: "user-2",
      username: "grace.hopper",
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser, secondUser],
    } as Response);

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![1].username).toBe("grace.hopper");
  });

  test("returns an empty array when the API returns no users", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  // -
  test("sets error state when the API responds with a non-ok status", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Failed to fetch users: 500",
    );
    expect(result.current.data).toBeUndefined();
  });

  test("sets error state when fetch rejects (network failure)", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe("Network error");
  });

  test("does not refetch within the staleTime window", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockUser],
    } as Response);

    const wrapper = makeWrapper();

    const { result: r1 } = renderHook(() => useUsers(), { wrapper });
    await waitFor(() => expect(r1.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(() => useUsers(), { wrapper });
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
