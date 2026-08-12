"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ role, homePath, counterpart }) {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function changeMode(nextMode) {
    setMode(nextMode);
    setFormError("");
    setFieldErrors({});
  }

  function clearFieldError(name) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      displayName: String(data.get("displayName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || ""),
    };
    const validationErrors = validate(values, mode);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFormError("");
      form.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    setBusy(true);
    setFormError("");
    setFieldErrors({});
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          displayName: values.displayName || undefined,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(payload?.error?.message || "We could not complete that request. Please try again.");
        return;
      }
      router.replace(homePath);
      router.refresh();
    } catch {
      setFormError("Curais is temporarily unavailable. Please wait a moment and try again.");
    } finally {
      setBusy(false);
    }
  }

  const audience = role === "doctor" ? "Doctor" : "Patient";
  return (
    <main className="page-blobs flex min-h-dvh items-center justify-center px-4 py-10 text-aid-ink">
      <section className="glass-strong relative z-10 w-full max-w-md rounded-[2rem] p-6 md:p-8">
        <BrandMark />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-aid-teal">
          {audience} app
        </p>
        <h1 className="mt-2 font-quicksand text-3xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-aid-muted">
          {mode === "signin"
            ? `Sign in to your private ${audience.toLowerCase()} workspace.`
            : `Set up a secure ${audience.toLowerCase()} workspace in a minute.`}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-white/35 p-1" aria-label="Authentication mode">
          {["signin", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => changeMode(item)}
              aria-pressed={mode === item}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                mode === item ? "bg-aid-ink text-white" : "text-aid-muted hover:bg-white/40"
              }`}
            >
              {item === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          {mode === "signup" ? (
            <Field
              label="Full name"
              name="displayName"
              autoComplete="name"
              error={fieldErrors.displayName}
              onChange={() => clearFieldError("displayName")}
            />
          ) : null}
          <Field
            label="Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            error={fieldErrors.email}
            onChange={() => clearFieldError("email")}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            hint={mode === "signup" ? "Use at least 10 characters." : undefined}
            error={fieldErrors.password}
            onChange={() => clearFieldError("password")}
          />
          {formError ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-sm font-semibold text-aid-emergency">
              {formError}
            </p>
          ) : null}
          <button
            disabled={busy}
            className="w-full rounded-2xl bg-aid-teal px-4 py-3 font-bold text-white transition hover:bg-aid-teal-deep disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {role === "doctor" && mode === "signup" ? (
          <p className="mt-4 text-xs leading-relaxed text-aid-muted">
            Doctor accounts require clinic membership before patient records become visible.
          </p>
        ) : null}
        {counterpart ? (
          <a className="mt-6 block text-center text-sm font-bold text-aid-teal hover:underline" href={counterpart.href}>
            {counterpart.label}
          </a>
        ) : null}
      </section>
    </main>
  );
}

function Field({ label, hint, error, name, ...props }) {
  const inputID = `auth-${name}`;
  const errorID = `${inputID}-error`;
  const hintID = `${inputID}-hint`;
  const describedBy = [error ? errorID : "", hint ? hintID : ""].filter(Boolean).join(" ") || undefined;

  return (
    <label htmlFor={inputID} className="block text-sm font-bold text-aid-ink">
      {label}
      <input
        {...props}
        id={inputID}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`mt-1.5 w-full rounded-xl border bg-white/55 px-3 py-3 font-normal outline-none transition focus:ring-2 ${
          error
            ? "border-aid-emergency/60 focus:border-aid-emergency focus:ring-aid-emergency/15"
            : "border-white/70 focus:border-aid-teal focus:ring-aid-teal/20"
        }`}
      />
      {error ? (
        <span id={errorID} className="mt-1.5 block text-xs font-semibold text-aid-emergency">
          {error}
        </span>
      ) : null}
      {hint ? (
        <span id={hintID} className="mt-1 block text-xs font-normal text-aid-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function validate(values, mode) {
  const errors = {};
  if (mode === "signup" && values.displayName.length < 2) {
    errors.displayName = "Enter your full name.";
  }
  if (!values.email) {
    errors.email = "Enter your email address.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }
  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (mode === "signup" && values.password.length < 10) {
    errors.password = "Password must contain at least 10 characters.";
  }
  return errors;
}
