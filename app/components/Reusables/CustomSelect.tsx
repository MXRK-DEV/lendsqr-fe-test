"use client";

import React, { useId, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import styles from "../reusablescssmodules/CustomSelect.module.scss";

const cn = (...inputs: ClassValue[]) => clsx(inputs);

interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  title?: string;
  titleClassName?: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  borderBox?: boolean;
  showStar?: boolean;
  id?: string;
  options?: OptionType[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  optionClassName?: string;
}

const CustomSelect: React.FC<SelectProps> = ({
  title,
  titleClassName = "",
  className = "",
  wrapperClassName = "",
  placeholder,
  borderBox = true,
  showStar = false,
  id: externalId,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled,
  optionClassName = "",
}) => {
  const generatedId = useId();
  const id = externalId || `select-${generatedId}`;

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const controlled = value !== undefined;
  const selectedValue = controlled ? value : internalValue;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? null;

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
        maxHeight: "280px",
        overflowY: "auto",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      } as React.CSSProperties);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !document.getElementById(`portal-${id}`)?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [id]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const portal = document.getElementById(`portal-${id}`);
      if (portal && portal.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, id]);

  const handleSelect = (opt: OptionType) => {
    if (opt.disabled) return;
    setOpen(false);
    if (!controlled) setInternalValue(opt.value);
    if (onChange) {
      onChange({
        target: { value: opt.value },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  const triggerClasses = cn(
    styles.trigger,
    borderBox ? styles.boxBorder : styles.boxContent,
    disabled && styles.triggerDisabled,
    className,
  );

  const labelClasses = cn(styles.label, titleClassName);

  const dropdown = open
    ? createPortal(
        <ul
          id={`portal-${id}`}
          role="listbox"
          style={dropdownStyle}
          className={styles.dropdownList}
        >
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
                className={cn(
                  styles.option,
                  opt.disabled && styles.optionDisabled,
                  isSelected && !opt.disabled && styles.optionSelected,
                  optionClassName,
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D89A53"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  const content = (
    <div ref={containerRef} className={styles.selectWrapper}>
      {title && (
        <label htmlFor={id} className={labelClasses}>
          {title}
          {showStar && <span className={styles.star}>*</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        className={triggerClasses}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel ?? (
          <span className={styles.placeholder}>{placeholder ?? "Select…"}</span>
        )}
      </button>

      {dropdown}
    </div>
  );

  return wrapperClassName ? (
    <div className={wrapperClassName}>{content}</div>
  ) : (
    content
  );
};

export default CustomSelect;
