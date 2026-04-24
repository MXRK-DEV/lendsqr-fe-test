import UserDetailProvider from "@/app/provider/UserDetailProvider";

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDetailProvider>{children}</UserDetailProvider>;
}
