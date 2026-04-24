"use client";

import React, {
  InputHTMLAttributes,
  useEffect,
  useState,
  useId,
  useRef,
} from "react";
import Image from "next/image";
import styles from "../reusablescssmodules/CustomInput.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  titleClassName?: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  borderBox?: boolean;
  showCounter?: boolean;
  showStar?: boolean;
  id?: string;
  datePicker?: boolean;
  dateFormat?: (date: Date) => string;
}

const CustomInput: React.FC<InputProps> = ({
  title,
  titleClassName = "",
  className = "",
  wrapperClassName = "",
  placeholder,
  borderBox = true,
  showCounter = false,
  showStar = false,
  value,
  onChange,
  maxLength,
  id: externalId,
  datePicker = false,
  dateFormat = (date) => date.toISOString().split("T")[0],
  ...rest
}) => {
  const generatedId = useId();
  const id = externalId || `input-${generatedId}`;

  const [currentLength, setCurrentLength] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showCounter && value !== undefined) {
      setCurrentLength(String(value).length);
    }
  }, [value, showCounter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showCounter) {
      setCurrentLength(e.target.value.length);
    }
    onChange?.(e);
  };

  const handleDateIconClick = () => {
    if (isPickerOpen) {
      hiddenDateInputRef.current?.blur();
      setIsPickerOpen(false);
    } else {
      setIsPickerOpen(true);
      hiddenDateInputRef.current?.showPicker?.();
      hiddenDateInputRef.current?.click();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;

    if (dateStr) {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      const formatted = dateFormat(date);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    }

    setIsPickerOpen(false);
  };

  const handleDateBlur = () => {
    setIsPickerOpen(false);
  };

  const inputClasses = [
    styles.input,
    borderBox ? styles.boxBorder : styles.boxContent,
    datePicker ? styles.datePickerInput : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName || styles.wrapper}>
      {title && (
        <label htmlFor={id} className={`${styles.label} ${titleClassName}`}>
          {title}
          {showStar && <span className={styles.star}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          id={id}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...rest}
        />

        {datePicker && (
          <>
            <button
              type="button"
              onClick={handleDateIconClick}
              className={styles.calendarButton}
              aria-label={
                isPickerOpen ? "Close date picker" : "Open date picker"
              }
            >
              <Image
                src="/icon/calendar.svg"
                alt="Calendar"
                width={16}
                height={16}
              />
            </button>

            <input
              ref={hiddenDateInputRef}
              type="date"
              className={styles.hiddenDateInput}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              aria-hidden="true"
              tabIndex={-1}
            />
          </>
        )}
      </div>

      {showCounter && maxLength && (
        <div className={styles.counter}>
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
