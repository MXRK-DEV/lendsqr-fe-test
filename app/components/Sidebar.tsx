"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./componentsscssmodules/Sidebar.module.scss";
import { useAuthUser } from "@/hooks/useAuthUser";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuthUser();
  const isUsersActive = pathname.startsWith("/users");

  const [showHint, setShowHint] = useState(false);
  const hintCount = useRef(0);

  useEffect(() => {
    setShowHint(true);
    hintCount.current = 1;

    const firstTimer = setTimeout(() => {
      setShowHint(false);

      // 3 minutes
      const secondTimer = setTimeout(
        () => {
          setShowHint(true);
          hintCount.current = 2;

          const hideTimer = setTimeout(() => {
            setShowHint(false);
          }, 3000);

          return () => clearTimeout(hideTimer);
        },
        3 * 60 * 1000,
      );

      return () => clearTimeout(secondTimer);
    }, 3000);

    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Image
          src="/icon/lendsqrlogo.svg"
          alt="Lendsqr Logo"
          width={144.8}
          height={70}
          priority
        />
      </div>

      {/* Scroll hint */}
      <div className={`${styles.hint} ${showHint ? styles.hintVisible : ""}`}>
        <span className={styles.hintDots}>
          <span className={styles.hintDot} style={{ animationDelay: "0ms" }} />
          <span
            className={styles.hintDot}
            style={{ animationDelay: "150ms" }}
          />
          <span
            className={styles.hintDot}
            style={{ animationDelay: "300ms" }}
          />
        </span>
        Scroll to see more
      </div>

      {/* Scrollable Navigation */}
      <nav className={styles.nav}>
        <div className={`${styles.navLink} ${styles.switchOrgLink}`}>
          <Image
            src="/icon/briefcase.svg"
            alt="Briefcase"
            width={16}
            height={16}
            priority
          />
          <span>Switch Organization</span>
          <IoIosArrowDown size={14} className={styles.chevron} />
        </div>

        <div className={`${styles.navLink} ${styles.dashboardLink}`}>
          <Image
            src="/icon/dashboard.svg"
            alt="Dashboard"
            width={16}
            height={16}
            priority
          />
          <span>Dashboard</span>
        </div>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderText}>CUSTOMERS</span>
        </div>

        <div className={isUsersActive ? styles.activeNavLink : styles.navLink}>
          <Image
            src="/icon/user.svg"
            alt="Users"
            width={16}
            height={16}
            priority
          />
          <span>Users</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/guarantors.svg"
            alt="Guarantors"
            width={16}
            height={16}
            priority
          />
          <span>Guarantors</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/loans.svg"
            alt="Loans"
            width={16}
            height={16}
            priority
          />
          <span>Loans</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/decision.svg"
            alt="Decision Models"
            width={16}
            height={16}
            priority
          />
          <span>Decision Models</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/savings.svg"
            alt="Savings"
            width={16}
            height={16}
            priority
          />
          <span>Savings</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/loan.svg"
            alt="Loan Requests"
            width={16}
            height={16}
            priority
          />
          <span>Loan Requests</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/whitelist.svg"
            alt="Whitelist"
            width={16}
            height={16}
            priority
          />
          <span>Whitelist</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/karma.svg"
            alt="Karma"
            width={16}
            height={16}
            priority
          />
          <span>Karma</span>
        </div>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderText}>BUSINESSES</span>
        </div>

        <div className={styles.navLink}>
          <Image
            src="/icon/briefcase.svg"
            alt="Briefcase"
            width={16}
            height={16}
            priority
          />
          <span>Organization</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/loans.svg"
            alt="Loans"
            width={16}
            height={16}
            priority
          />
          <span>Loan Products</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/savingsproduct.svg"
            alt="Savings Products"
            width={16}
            height={16}
            priority
          />
          <span>Savings Products</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/fees.svg"
            alt="Fees and Charges"
            width={16}
            height={16}
            priority
          />
          <span>Fees and Charges</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/transactions2.svg"
            alt="Transactions"
            width={16}
            height={16}
            priority
          />
          <span>Transactions</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/services.svg"
            alt="Services"
            width={16}
            height={16}
            priority
          />
          <span>Services</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/service.svg"
            alt="Service"
            width={16}
            height={16}
            priority
          />
          <span>Service Account</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/settlements.svg"
            alt="Settlements"
            width={16}
            height={16}
            priority
          />
          <span>Settlements</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/reports.svg"
            alt="Reports"
            width={16}
            height={16}
            priority
          />
          <span>Reports</span>
        </div>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionHeaderText}>SETTINGS</span>
        </div>

        <div className={styles.navLink}>
          <Image
            src="/icon/preferences.svg"
            alt="Preferences"
            width={16}
            height={16}
            priority
          />
          <span>Preferences</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/pricing.svg"
            alt="Pricing"
            width={16}
            height={16}
            priority
          />
          <span>Fees and Pricing</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/auditlogs.svg"
            alt="Audit Logs"
            width={16}
            height={16}
            priority
          />
          <span>Audit Logs</span>
        </div>
        <div className={styles.navLink}>
          <Image
            src="/icon/systemsmessages.svg"
            alt="Audit Logs"
            width={16}
            height={16}
            priority
          />
          <span>Systems Messages</span>
        </div>
        <div className={styles.logoutWrapper}>
          <div className={styles.logoutLink} onClick={logout}>
            <Image
              src="/icon/signout.svg"
              alt="Dashboard"
              width={16}
              height={16}
              priority
            />
            <span>Logout</span>
          </div>
        </div>
        <div className={styles.vWrapper}>
          <div className={styles.vLink}>
            <span>v1.2.0</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
