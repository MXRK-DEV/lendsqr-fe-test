"use client";

import React, { useState } from "react";
import CustomInput from "./Reusables/CustomInput";
import CustomInputPassword from "./Reusables/CustomInputPassword";
import Image from "next/image";
import styles from "./Login.module.scss";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Login successful!");
      router.push("/users");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <Image
            src="/icon/lendsqrlogo.svg"
            alt="Lendsqr Logo"
            width={130}
            height={40}
            priority
          />
        </div>

        <div className={styles.illustration}>
          <Image
            src="/icon/lendsqrloginpagedesign.svg"
            alt="Illustration"
            width={500}
            height={500}
            className={styles.illustrationImage}
            priority
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.mobileLogo}>
            <Image
              src="/icon/lendsqrlogo.svg"
              alt="Lendsqr Logo"
              width={120}
              height={36}
            />
          </div>

          <div className={styles.heading}>
            <h1>Welcome!</h1>
            <p>Enter details to login.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}
            <div>
              <CustomInput
                className={styles.input}
                wrapperClassName={styles.inputWrapper}
                titleClassName={styles.inputTitle}
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                borderBox
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <CustomInputPassword
                className={styles.input}
                wrapperClassName={styles.inputWrapper}
                titleClassName={styles.inputTitle}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                borderBox
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password}</p>
              )}
            </div>

            <div className={styles.forgotPassword}>
              <a href="#">FORGOT PASSWORD?</a>
            </div>

            <button type="submit" className={styles.submitButton}>
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
