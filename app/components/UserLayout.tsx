"use client";

import React from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import styles from "./componentsscssmodules/UserLayout.module.scss";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      {/* Main section */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <Header />
        </header>

        {/* Content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
