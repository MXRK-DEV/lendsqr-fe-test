"use client";

import React from "react";
import { InfoCard } from "./Reusables/Card";
import UserTable from "./UserTable";
import { useUsers } from "@/hooks/useUsers";
import styles from "./componentsscssmodules/Users.module.scss";

const InfoCardSkeleton = () => (
  <div className={styles.cardSkeleton}>
    <div className={styles.icon} />
    <div className={styles.lineShort} />
    <div className={styles.lineLong} />
  </div>
);

const Users = () => {
  const { data: users = [], isLoading } = useUsers();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const usersWithLoans = users.filter((u) => u.hasLoan).length;
  const usersWithSavings = users.filter((u) => u.hasSavings).length;

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users</h1>

      <div className={styles.cardsWrapper}>
        {isLoading ? (
          <>
            <InfoCardSkeleton />
            <InfoCardSkeleton />
            <InfoCardSkeleton />
            <InfoCardSkeleton />
          </>
        ) : (
          <>
            <InfoCard
              imageSrc="/icon/users1.svg"
              imageAlt="Users icon"
              label="USERS"
              value={fmt(totalUsers)}
            />
            <InfoCard
              imageSrc="/icon/activeusers2.svg"
              imageAlt="Active Users icon"
              label="ACTIVE USERS"
              value={fmt(activeUsers)}
            />
            <InfoCard
              imageSrc="/icon/userswithloans.svg"
              imageAlt="Users with Loans icon"
              label="USERS WITH LOANS"
              value={fmt(usersWithLoans)}
            />
            <InfoCard
              imageSrc="/icon/userswithsavings.svg"
              imageAlt="Users with Savings icon"
              label="USERS WITH SAVINGS"
              value={fmt(usersWithSavings)}
            />
          </>
        )}
      </div>

      <UserTable />
    </div>
  );
};

export default Users;
