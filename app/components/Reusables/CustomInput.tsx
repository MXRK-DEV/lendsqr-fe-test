"use client";

import React, { InputHTMLAttributes, useEffect, useState, useId } from "react";
import { clsx } from "clsx";
import styles from "../reusablescssmodules/CustomInput.module.scss";

const cn = (...inputs: string[]) => clsx(inputs);

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
  ...rest
}) => {
  const generatedId = useId();
  const id = externalId || `input-${generatedId}`;
  const [currentLength, setCurrentLength] = useState(0);

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

  const inputClasses = cn(
    borderBox ? styles.boxBorder : styles.boxContent,
    styles.input,
    className,
  );

  const inputElement = (
    <input
      id={id}
      className={inputClasses || undefined}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      {...rest}
    />
  );

  const labelClasses = cn(styles.label, titleClassName);

  const content = (
    <>
      {title && (
        <label htmlFor={id} className={labelClasses}>
          {title}
          {showStar && <span className={styles.star}>*</span>}
        </label>
      )}
      {inputElement}
      {showCounter && maxLength && (
        <div className={styles.counter}>
          {currentLength} / {maxLength}
        </div>
      )}
    </>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{content}</div>;
  }

  return content;
};

export default CustomInput;
