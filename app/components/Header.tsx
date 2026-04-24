"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";

import { useAuthUser } from "@/hooks/useAuthUser";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
};

const Header = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { displayName } = useAuthUser();

  const searchIconRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchIconRef.current &&
        !searchIconRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  // Close dropdown for Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  // Close dropdown auto switch from mobile to desktop
  useEffect(() => {
    if (!isMobile && isSearchOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobile, isSearchOpen]);

  // Auto-focus input dropdown-opening
  useEffect(() => {
    if (isSearchOpen && dropdownRef.current) {
      const input = dropdownRef.current.querySelector("input");
      input?.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/users?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/users");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      router.push("/users");
    }
  };

  const mobileHandleSearch = () => {
    handleSearch();
    setIsSearchOpen(false);
  };

  const mobileHandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      mobileHandleSearch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {!isMobile ? (
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything"
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              <IoIosSearch size={20} />
            </button>
          </div>
        ) : (
          <>
            <button
              ref={searchIconRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={styles.mobileSearchIcon}
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <IoIosSearch size={24} />
            </button>
            {isSearchOpen && (
              <div ref={dropdownRef} className={styles.searchDropdown}>
                <div className={styles.mobileSearchWrapper}>
                  <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={mobileHandleKeyDown}
                    placeholder="Search for anything"
                    className={styles.mobileSearchInput}
                  />
                  <button
                    onClick={mobileHandleSearch}
                    className={styles.mobileSearchButton}
                  >
                    <IoIosSearch size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.actions}>
        <a href="#" className={styles.docsLink}>
          Docs
        </a>

        <button className={styles.notificationButton}>
          <Image
            src="/icon/bell1.svg"
            alt="Notification Bell"
            width={19.67}
            height={22.74}
            priority
          />
        </button>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            <Image
              src="/icon/adedeji.svg"
              alt="Adedeji Avatar"
              width={48}
              height={60}
              priority
            />
          </div>

          <span className={styles.userName}>{displayName}</span>
          <FaCaretDown size={16} className={styles.caret} />
        </div>
      </div>
    </header>
  );
};

export default Header;
