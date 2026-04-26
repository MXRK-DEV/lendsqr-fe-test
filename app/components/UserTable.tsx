"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { IoFilterSharp } from "react-icons/io5";
import { MdMoreVert } from "react-icons/md";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUsers, type UserData } from "@/hooks/useUsers";
import Pagination from "./Reusables/Pagination";
import CustomSelect from "./Reusables/CustomSelect";
import CustomInput from "./Reusables/CustomInput";
import styles from "./componentsscssmodules/UserTable.module.scss";

const UserTable: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const globalSearch = searchParams.get("search")?.toLowerCase() ?? "";
  const { data: users = [], isLoading, error } = useUsers();

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter dropdown state
  const [filterOpenIndex, setFilterOpenIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    openUpward: false,
  });
  const filterRef = useRef<HTMLDivElement>(null);
  const filterIconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Form state for filter fields
  const [organization, setOrganization] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [status, setStatus] = useState("");

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    organization: "",
    username: "",
    email: "",
    phoneNumber: "",
    dateJoined: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const DROPDOWN_HEIGHT = 600;

  const headers = [
    "ORGANIZATION",
    "USERNAME",
    "EMAIL",
    "PHONE NUMBER",
    "DATE JOINED",
    "STATUS",
  ] as const;

  // Status style
  const getStatusClass = (status: UserData["status"]) => {
    switch (status) {
      case "Inactive":
        return styles.statusInactive;
      case "Pending":
        return styles.statusPending;
      case "Blacklisted":
        return styles.statusBlacklisted;
      case "Active":
        return styles.statusActive;
      default:
        return "";
    }
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  //  action dropdown when you clicking surrounding
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownIndex !== null) {
        if ((event.target as Element).closest?.('[aria-label="More options"]'))
          return;

        const currentRef = dropdownRefs.current[openDropdownIndex];
        if (currentRef && !currentRef.contains(event.target as Node)) {
          setOpenDropdownIndex(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownIndex]);

  // Close filter when you click on surroundings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterOpenIndex === null) return;
      const target = event.target as Node;

      if ((target as Element).closest?.("[data-filter-icon]")) return;

      if (filterRef.current && filterRef.current.contains(target)) return;

      const isSelectOption = (target as Element).closest?.(
        '[role="listbox"], .select-dropdown, .custom-select-menu, .react-select__menu, .date-picker-dropdown, .select-options',
      );

      if (!isSelectOption) {
        setFilterOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpenIndex]);

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  // flip logic
  const updateDropdownPosition = useCallback(() => {
    if (filterOpenIndex !== null) {
      const iconElement = filterIconRefs.current[filterOpenIndex];

      if (iconElement) {
        const rect = iconElement.getBoundingClientRect();

        const left = rect.left + rect.width / 2;
        const top = rect.bottom + 8;

        setDropdownPosition({
          top,
          left,
          openUpward: false,
        });
      }
    }
  }, [filterOpenIndex]);

  useEffect(() => {
    if (filterOpenIndex !== null) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [filterOpenIndex, updateDropdownPosition]);

  const handleFilterClick = (index: number) => {
    setFilterOpenIndex(filterOpenIndex === index ? null : index);
  };

  const handleReset = () => {
    setOrganization("");
    setUsername("");
    setEmail("");
    setPhoneNumber("");
    setDateJoined("");
    setStatus("");
    setAppliedFilters({
      organization: "",
      username: "",
      email: "",
      phoneNumber: "",
      dateJoined: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    setAppliedFilters({
      organization: organization.trim(),
      username: username.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      dateJoined: dateJoined.trim(),
      status: status,
    });
    setCurrentPage(1);
    setFilterOpenIndex(null);
  };

  // extract string value
  const extractValue = (
    val: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): string => {
    if (typeof val === "string") return val;
    return val?.target?.value ?? "";
  };

  // Compute filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (
        appliedFilters.organization &&
        !user.organization
          .toLowerCase()
          .includes(appliedFilters.organization.toLowerCase())
      )
        return false;

      if (
        appliedFilters.username &&
        !user.username
          .toLowerCase()
          .includes(appliedFilters.username.toLowerCase())
      )
        return false;

      if (
        appliedFilters.email &&
        !user.email.toLowerCase().includes(appliedFilters.email.toLowerCase())
      )
        return false;

      if (
        appliedFilters.phoneNumber &&
        !user.phone.includes(appliedFilters.phoneNumber)
      )
        return false;

      if (appliedFilters.dateJoined) {
        let matched = false;
        try {
          const [y, m, d] = appliedFilters.dateJoined.split("-").map(Number);
          const rowDate = new Date(user.dateJoined);
          matched =
            rowDate.getFullYear() === y &&
            rowDate.getMonth() + 1 === m &&
            rowDate.getDate() === d;
        } catch {}
        if (!matched) return false;
      }

      if (appliedFilters.status && user.status !== appliedFilters.status)
        return false;

      if (globalSearch) {
        const haystack = [
          user.username,
          user.email,
          user.organization,
          user.phone,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(globalSearch)) return false;
      }

      return true;
    });
  }, [users, appliedFilters, globalSearch]);

  // Pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredUsers.slice(startIndex, endIndex);
  const [showHint, setShowHint] = useState(false);
  const hintCount = useRef(0);
  const hintTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (filterOpenIndex === null) {
      setShowHint(false);
      hintTimers.current.forEach(clearTimeout);
      hintTimers.current = [];
      return;
    }

    hintCount.current = 0;

    const showAndHide = () => {
      setShowHint(true);
      hintCount.current++;

      const hideTimer = setTimeout(() => {
        setShowHint(false);
      }, 3000);

      hintTimers.current.push(hideTimer);
    };

    showAndHide();

    const repeatTimer = setTimeout(
      () => {
        showAndHide();
      },
      3 * 60 * 1000,
    );

    hintTimers.current.push(repeatTimer);

    return () => {
      hintTimers.current.forEach(clearTimeout);
      hintTimers.current = [];
    };
  }, [filterOpenIndex]);

  // Active filter badge count
  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  //  cell class names
  const getCellClass = (isLastRow: boolean, isHiddenOnMobile: boolean) => {
    return [
      styles.tableCell,
      isLastRow ? styles.lastRowCell : "",
      isHiddenOnMobile ? styles.hiddenOnMobile : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorText}>
            Error loading users. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        {/* Active filter indicator */}
        {activeFilterCount > 0 && (
          <div className={styles.filterIndicator}>
            <span className={styles.filterBadge}>
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              active
            </span>
            <span className={styles.filterResultsDot}>·</span>
            <span className={styles.filterResultsText}>
              {totalItems} result{totalItems !== 1 ? "s" : ""} found
            </span>
            <button onClick={handleReset} className={styles.clearFiltersButton}>
              Clear all filters
            </button>
          </div>
        )}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>
                  <div className={styles.tableHeaderContent}>
                    <span>ORGANIZATION</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[0] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 0
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(0)}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className={`${styles.tableHeaderCell} ${styles.hiddenOnMobile}`}
                >
                  <div className={styles.tableHeaderContent}>
                    <span>USERNAME</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[1] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 1
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(1)}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className={`${styles.tableHeaderCell} ${styles.hiddenOnMobile}`}
                >
                  <div className={styles.tableHeaderContent}>
                    <span>EMAIL</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[2] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 2
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(2)}
                      />
                    </div>
                  </div>
                </th>

                <th className={styles.tableHeaderCell}>
                  <div className={styles.tableHeaderContent}>
                    <span>PHONE NUMBER</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[3] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 3
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(3)}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className={`${styles.tableHeaderCell} ${styles.hiddenOnMobile}`}
                >
                  <div className={styles.tableHeaderContent}>
                    <span>DATE JOINED</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[4] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 4
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(4)}
                      />
                    </div>
                  </div>
                </th>

                <th className={styles.tableHeaderCell}>
                  <div className={styles.tableHeaderContent}>
                    <span>STATUS</span>
                    <div
                      ref={(el) => {
                        filterIconRefs.current[5] = el;
                      }}
                      className={styles.filterIconWrapper}
                      data-filter-icon="true"
                    >
                      <IoFilterSharp
                        className={`${styles.filterIcon} ${
                          filterOpenIndex === 5
                            ? styles.filterIconActive
                            : styles.filterIconInactive
                        }`}
                        size={14}
                        onClick={() => handleFilterClick(5)}
                      />
                    </div>
                  </div>
                </th>
                {/* Actions column */}
                <th
                  className={styles.tableHeaderCell}
                  style={{ width: "2.5rem" }}
                />
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.tableCell}>
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => {
                  const isLastRow = index === paginatedData.length - 1;
                  return (
                    <tr key={index} className={styles.tableRow}>
                      <td className={getCellClass(isLastRow, false)}>
                        {row.organization}
                      </td>
                      <td className={getCellClass(isLastRow, true)}>
                        {row.username}
                      </td>
                      <td className={getCellClass(isLastRow, true)}>
                        {row.email}
                      </td>
                      <td className={getCellClass(isLastRow, false)}>
                        {row.phone}
                      </td>
                      <td className={getCellClass(isLastRow, true)}>
                        {row.dateJoined}
                        {row.timeJoined ? ` ${row.timeJoined}` : ""}
                      </td>
                      <td className={getCellClass(isLastRow, false)}>
                        <span
                          className={`${styles.statusBadge} ${getStatusClass(
                            row.status,
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className={getCellClass(isLastRow, false)}>
                        <div className={styles.actionCell}>
                          <button
                            onClick={() => toggleDropdown(index)}
                            className={styles.moreButton}
                            aria-label="More options"
                          >
                            <MdMoreVert className={styles.moreIcon} size={20} />
                          </button>
                          {openDropdownIndex === index && (
                            <div
                              ref={(el) => {
                                dropdownRefs.current[index] = el;
                              }}
                              className={styles.actionDropdown}
                            >
                              <button
                                onClick={() => {
                                  setOpenDropdownIndex(null);
                                  router.push(`/users/detail/${row.id}`);
                                }}
                                className={styles.actionDropdownItem}
                              >
                                <Image
                                  src="/icon/viewdetails.svg"
                                  alt="View Details"
                                  width={16}
                                  height={16}
                                />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  toast.warning(
                                    `${row.username} has been blacklisted.`,
                                    { position: "bottom-right" },
                                  );
                                  setOpenDropdownIndex(null);
                                }}
                                disabled={
                                  row.status !== "Active" &&
                                  row.status !== "Pending"
                                }
                                className={`${styles.actionDropdownItem} ${
                                  row.status !== "Active" &&
                                  row.status !== "Pending"
                                    ? styles.actionDropdownItemDisabled
                                    : ""
                                }`}
                              >
                                <Image
                                  src="/icon/blacklistuser.svg"
                                  alt="Blacklist User"
                                  width={16}
                                  height={16}
                                />
                                Blacklist User
                              </button>
                              <button
                                onClick={() => {
                                  toast.success(
                                    `${row.username} has been activated.`,
                                    { position: "bottom-right" },
                                  );
                                  setOpenDropdownIndex(null);
                                }}
                                disabled={
                                  row.status !== "Blacklisted" &&
                                  row.status !== "Pending"
                                }
                                className={`${styles.actionDropdownItem} ${
                                  row.status !== "Blacklisted" &&
                                  row.status !== "Pending"
                                    ? styles.actionDropdownItemDisabled
                                    : ""
                                }`}
                              >
                                <Image
                                  src="/icon/activateuser.svg"
                                  alt="Activate User"
                                  width={16}
                                  height={16}
                                />
                                Activate User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Filter Dropdown */}
        {filterOpenIndex !== null &&
          createPortal(
            <div
              ref={filterRef}
              className={styles.filterDropdown}
              style={{
                width: "270px",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Scroll hint */}
              <div
                className={`${styles.scrollHint} ${
                  showHint ? styles.scrollHintVisible : styles.scrollHintHidden
                }`}
              >
                <span className={styles.scrollHintDots}>
                  <span
                    className={styles.scrollHintDot}
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className={styles.scrollHintDot}
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className={styles.scrollHintDot}
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
                Scroll your screen to see more
              </div>

              <div
                className={styles.filterForm}
                style={{ maxHeight: `${DROPDOWN_HEIGHT - 20}px` }}
              >
                <CustomSelect
                  title="Organization"
                  titleClassName={styles.filterFieldTitle}
                  placeholder="Select organization"
                  className={styles.filterField}
                  optionClassName={styles.option}
                  wrapperClassName="bg-transparent"
                  options={[
                    { value: "Lendsqr", label: "Lendsqr" },
                    { value: "Irorun", label: "Irorun" },
                    { value: "Lendstar", label: "Lendstar" },
                    { value: "Paystack", label: "Paystack" },
                    { value: "Flutterwave", label: "Flutterwave" },
                  ]}
                  value={organization}
                  onChange={(e) => setOrganization(extractValue(e))}
                />
                <CustomInput
                  className={styles.filterField}
                  wrapperClassName="bg-transparent"
                  titleClassName={styles.filterFieldTitle}
                  title="Username"
                  placeholder="User"
                  value={username}
                  onChange={(e) => setUsername(extractValue(e))}
                  borderBox
                />
                <CustomInput
                  className={styles.filterField}
                  wrapperClassName="bg-transparent"
                  titleClassName={styles.filterFieldTitle}
                  title="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(extractValue(e))}
                  borderBox
                />
                <CustomInput
                  className={styles.filterField}
                  wrapperClassName="bg-transparent"
                  titleClassName={styles.filterFieldTitle}
                  title="Date"
                  placeholder="Date"
                  value={dateJoined}
                  onChange={(e) => setDateJoined(extractValue(e))}
                  datePicker
                  borderBox
                  dateFormat={(date: Date) => {
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, "0");
                    const d = String(date.getDate()).padStart(2, "0");
                    return `${y}-${m}-${d}`;
                  }}
                />
                <CustomInput
                  className={styles.filterField}
                  wrapperClassName="bg-transparent"
                  titleClassName={styles.filterFieldTitle}
                  title="Phone Number"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(extractValue(e))}
                  borderBox
                />
                <CustomSelect
                  title="Status"
                  titleClassName={styles.filterFieldTitle}
                  placeholder="Select status"
                  className={styles.filterField}
                  optionClassName={styles.option}
                  wrapperClassName="bg-transparent"
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                    { value: "Pending", label: "Pending" },
                    { value: "Blacklisted", label: "Blacklisted" },
                  ]}
                  value={status}
                  onChange={(e) => setStatus(extractValue(e))}
                />

                <div className={styles.filterActions}>
                  <button
                    onClick={handleReset}
                    className={styles.filterResetButton}
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilter}
                    className={styles.filterApplyButton}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </>
  );
};

export default UserTable;
