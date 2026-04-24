import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import UserDetailProvider from "./UserDetailProvider";
import { type UserData } from "@/hooks/useUsers";

jest.mock("next/navigation", () => ({ useParams: jest.fn() }));

jest.mock("@/app/components/UserDetail", () => ({
  __esModule: true,
  default: ({ user }: { user: UserData }) => (
    <div data-testid="user-detail-card">{user.fullName}</div>
  ),
}));

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
  guarantors: [],
};

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderProvider(ui = <span data-testid="child">child</span>) {
  return render(<UserDetailProvider>{ui}</UserDetailProvider>, {
    wrapper: makeWrapper(),
  });
}

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
  (useParams as jest.Mock).mockReturnValue({ id: "user-1" });
});

describe("UserDetailProvider", () => {
  test("shows spinner while fetching and no cache exists", () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

    renderProvider();

    expect(screen.getByText(/loading user data/i)).toBeInTheDocument();
    expect(screen.queryByTestId("user-detail-card")).not.toBeInTheDocument();
  });

  test("skips spinner and shows cached user while fetching", async () => {
    localStorage.setItem(`user_detail_user-1`, JSON.stringify(mockUser));
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

    renderProvider();

    // should NOT show spinner because cache hydrated the UI
    expect(screen.queryByText(/loading user data/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("user-detail-card")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });

  // SUCCESS = live data
  test("renders UserDetailCard and children when user is found", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-detail-card")).toBeInTheDocument(),
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("persists the live user to localStorage after a successful fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-detail-card")).toBeInTheDocument(),
    );

    const stored = localStorage.getItem("user_detail_user-1");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).fullName).toBe("Ada Lovelace");
  });

  test("live user takes priority over a stale cached user", async () => {
    const staleUser = { ...mockUser, fullName: "Stale Ada" };
    localStorage.setItem("user_detail_user-1", JSON.stringify(staleUser));

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByText("Ada Lovelace")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Stale Ada")).not.toBeInTheDocument();
  });

  // ERROR
  test("shows error message when fetch fails and no cache exists", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument(),
    );

    expect(screen.queryByTestId("user-detail-card")).not.toBeInTheDocument();
  });

  test("shows cached user when fetch fails instead of error screen", async () => {
    localStorage.setItem("user_detail_user-1", JSON.stringify(mockUser));
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-detail-card")).toBeInTheDocument(),
    );

    expect(screen.queryByText(/failed to load users/i)).not.toBeInTheDocument();
  });

  // NOT FOUND
  test("shows not-found message when id matches no user in the list", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...mockUser, id: "user-99" }], // different id
    } as Response);

    renderProvider();

    await waitFor(() =>
      expect(screen.getByText(/user not found/i)).toBeInTheDocument(),
    );

    expect(screen.getByText(/user-1/)).toBeInTheDocument();
  });

  // MISSING ID
  test("shows spinner/loading state when id param is absent", () => {
    (useParams as jest.Mock).mockReturnValue({});
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

    renderProvider();

    expect(screen.getByText(/loading user data/i)).toBeInTheDocument();
  });
});
