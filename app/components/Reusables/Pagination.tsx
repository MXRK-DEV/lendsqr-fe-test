"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import styles from "../reusablescssmodules/pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const ROWS_OPTIONS = [10, 20, 50, 100];

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowsSelect = (rows: number) => {
    onRowsPerPageChange(rows);
    setDropdownOpen(false);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <span className={styles.showingLabel}>Showing</span>

        <div ref={dropdownRef} className={styles.dropdownWrapper}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={styles.dropdownButton}
          >
            {rowsPerPage}
            <FaAngleDown
              className={`${styles.dropdownIcon} ${
                dropdownOpen ? styles.dropdownIconOpen : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {ROWS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleRowsSelect(opt)}
                  className={`${styles.dropdownOption} ${
                    opt === rowsPerPage
                      ? styles.dropdownOptionActive
                      : styles.dropdownOptionInactive
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className={styles.totalItems}>out of {totalItems}</span>
      </div>

      <div className={styles.mobilePagination}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={styles.arrowButton}
        >
          <FaAngleLeft />
        </button>

        <span className={styles.currentPageMobile}>{currentPage}</span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={styles.arrowButton}
        >
          <FaAngleRight />
        </button>
      </div>

      <div className={styles.desktopPagination}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={styles.desktopArrow}
        >
          <FaAngleLeft />
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.pageButtonActive : ""
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={styles.desktopArrow}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}
