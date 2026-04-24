"use client";

import Image from "next/image";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { useRouter, usePathname, useParams } from "next/navigation";
import { type UserData } from "@/hooks/useUsers";
import { toast } from "sonner";
import styles from "./componentsscssmodules/UserDetail.module.scss";

const TABS = [
  { label: "General Details", slug: "general" },
  { label: "Documents", slug: "document" },
  { label: "Bank Details", slug: "bank-details" },
  { label: "Loans", slug: "loans" },
  { label: "Savings", slug: "savings" },
  { label: "App and System", slug: "app-and-system" },
];

interface UserDetailCardProps {
  user: UserData;
}

const UserDetailCard = ({ user }: UserDetailCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  const renderStars = (tier: number) =>
    [1, 2, 3].map((i) =>
      i <= tier ? (
        <IoIosStar key={i} className={styles.starIcon} />
      ) : (
        <IoIosStarOutline key={i} className={styles.starIcon} />
      ),
    );

  const fmtBalance = (n: number) =>
    `₦${new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)}`;

  if (!user) return null;

  const canBlacklist = user.status === "Active" || user.status === "Pending";
  const canActivate =
    user.status === "Blacklisted" || user.status === "Pending";

  const handleBlacklist = () => {
    if (!canBlacklist) return;
    toast.warning(`${user.fullName} has been blacklisted.`, {
      position: "bottom-right",
    });
  };

  const handleActivate = () => {
    if (!canActivate) return;
    toast.success(`${user.fullName} has been activated.`, {
      position: "bottom-right",
    });
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.push("/users")}
        className={styles.backButton}
      >
        <Image
          src="/icon/arrow2.svg"
          alt="Back"
          width={26.718673706054688}
          height={9.384965896606445}
        />
        Back to Users
      </button>

      {/* Header row */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>User Details</h1>
        <div className={styles.actionButtons}>
          <button
            onClick={handleBlacklist}
            disabled={!canBlacklist}
            className={`${styles.blacklistButton} ${
              !canBlacklist ? styles.buttonDisabled : ""
            }`}
          >
            Blacklist User
          </button>
          <button
            onClick={handleActivate}
            disabled={!canActivate}
            className={`${styles.activateButton} ${
              !canActivate ? styles.buttonDisabled : ""
            }`}
          >
            Activate User
          </button>
        </div>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div className={styles.userInfo}>
            <Image
              src="/icon/userdetail.svg"
              alt="User"
              width={100}
              height={100}
            />
            <div>
              <h1 className={styles.userName}>{user.fullName}</h1>
              <span className={styles.userId}>{user.userId}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Tier */}
          <div className={styles.tierSection}>
            <h1 className={styles.tierLabel}>User&apos;s Tier</h1>
            <div className={styles.stars}>{renderStars(user.tier)}</div>
          </div>

          <div className={styles.divider} />

          {/* Bank */}
          <div className={styles.bankSection}>
            <h1 className={styles.balance}>
              {fmtBalance(user.accountBalance)}
            </h1>
            <div className={styles.bankDetails}>
              {`${user.accountNumber}/${user.bankName}`}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(({ label, slug }) => {
            const path = `/users/detail/${id}/${slug}`;
            const isActive = pathname === path;

            return (
              <button
                key={label}
                onClick={() => router.push(path)}
                className={`${styles.tab} ${
                  isActive ? styles.tabActive : styles.tabInactive
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.mobileActionButtons}>
        <button
          onClick={handleBlacklist}
          disabled={!canBlacklist}
          className={`${styles.blacklistButton} ${
            !canBlacklist ? styles.buttonDisabled : ""
          }`}
        >
          Blacklist User
        </button>
        <button
          onClick={handleActivate}
          disabled={!canActivate}
          className={`${styles.activateButton} ${
            !canActivate ? styles.buttonDisabled : ""
          }`}
        >
          Activate User
        </button>
      </div>
    </div>
  );
};

export default UserDetailCard;
