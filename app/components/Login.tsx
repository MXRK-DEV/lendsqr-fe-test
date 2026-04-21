"use client";

import React, { useState } from "react";
import CustomInput from "./Reusables/CustomInput";
import Image from "next/image";
import styles from "./Login.module.scss";
import CustomInputPassword from "./Reusables/CustomInputPassword";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    toast.success("Login successful!");
    router.push("/dashboard");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          {/* Logo */}
          <div className={styles.logo}>
            <Image
              src="/icon/lendsqrlogo.svg"
              alt="Lendsqr Logo"
              width={130}
              height={40}
              priority
            />
          </div>

          {/* Main illustration */}
          <div className={styles.illustration}>
            <Image
              src="/icon/lendsqrloginpagedesign.svg"
              alt="Login Illustration"
              width={500}
              height={500}
              className={styles.illustrationImage}
              priority
            />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formWrapper}>
            {/* Mobile Logo */}
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

            {/* Login Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <CustomInput
                className={styles.input}
                wrapperClassName={styles.inputWrapper}
                titleClassName={styles.inputTitle}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderBox
              />

              <CustomInputPassword
                className={styles.input}
                wrapperClassName={styles.inputWrapper}
                titleClassName={styles.inputTitle}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderBox
              />

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
    </>
  );
};

export default Login;
