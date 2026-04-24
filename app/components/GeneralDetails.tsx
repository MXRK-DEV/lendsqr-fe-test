"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import styles from "./GeneralDetails.module.scss";

const Field = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className={styles.field}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldValue}>{value ?? "—"}</span>
  </div>
);

const Divider = () => <div className={styles.divider} />;

const GeneralDetails = () => {
  const user = useUser();

  const fmtCurrency = (n: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(n)}`;

  return (
    <div className={styles.container}>
      {/* Personal Information */}
      <h1 className={styles.sectionTitle}>Personal Information</h1>

      <div className={styles.gridPersonal}>
        <div className={styles.field}>
          <span className={styles.label}>Full Name</span>
          <span className={styles.value}>{user?.fullName}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Phone Number</span>
          <span className={styles.value}>{user?.phone}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Email Address</span>
          <span className={styles.value}>{user?.email}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>BVN</span>
          <span className={styles.value}>{user?.bvn}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Gender</span>
          <span className={styles.value}>{user?.gender}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Marital Status</span>
          <span className={styles.value}>{user?.maritalStatus}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Children</span>
          <span className={styles.value}>{user?.children}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Type of Residence</span>
          <span className={styles.value}>{user?.typeOfResidence}</span>
        </div>
      </div>
      <Divider />

      {/* Education and Employment */}
      <h1 className={styles.sectionTitle}>Education and Employment</h1>

      <div className={styles.gridEducation}>
        <div className={styles.field}>
          <span className={styles.label}>Level of Education</span>
          <span className={styles.value}>{user?.levelOfEducation}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Employment Status</span>
          <span className={styles.value}>{user?.employmentStatus}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Sector of Employment</span>
          <span className={styles.value}>{user?.sectorOfEmployment}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Duration of Employment</span>
          <span className={styles.value}>{user?.durationOfEmployment}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Office Email</span>
          <span className={styles.value}>{user?.officeEmail}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Monthly Income</span>
          <span className={styles.value}>
            {user
              ? `${fmtCurrency(user.monthlyIncomeMin)} - ${fmtCurrency(
                  user.monthlyIncomeMax,
                )}`
              : "-"}
          </span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Loan Repayment</span>
          <span className={styles.value}>
            {user ? fmtCurrency(user.loanRepayment) : "-"}
          </span>
        </div>
      </div>

      <Divider />

      {/* Socials */}
      <h1 className={styles.sectionTitle}>Socials</h1>

      <div className={styles.socialsContainer}>
        <div className={styles.field}>
          <span className={styles.label}>Twitter</span>
          <span className={styles.value}>{user?.twitter}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Facebook</span>
          <span className={styles.value}>{user?.facebook}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Instagram</span>
          <span className={styles.value}>{user?.instagram}</span>
        </div>
      </div>

      <Divider />

      {/* Guarantors */}
      <h1 className={styles.sectionTitle}>Guarantor</h1>

      {user?.guarantors?.length ? (
        user.guarantors.map((g, i) => (
          <React.Fragment key={i}>
            <div className={styles.gridGuarantor}>
              <div className={styles.field}>
                <span className={styles.label}>Full Name</span>
                <span className={styles.value}>{g.fullName}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Phone Number</span>
                <span className={styles.value}>{g.phone}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{g.email}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Relationship</span>
                <span className={styles.value}>{g.relationship}</span>
              </div>
            </div>

            {i < user.guarantors.length - 1 && <Divider />}

            {i < user.guarantors.length - 1 && (
              <div className={styles.guarantorSpacer} />
            )}
          </React.Fragment>
        ))
      ) : (
        <p className={styles.emptyText}>No guarantors on record.</p>
      )}
    </div>
  );
};

export default GeneralDetails;
