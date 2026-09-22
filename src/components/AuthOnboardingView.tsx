import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  CheckCircle2,
} from "lucide-react";

export type AuthRole = "parent" | "healthcare";
type AuthMode = "signin" | "signup";
type Screen = "welcome" | "auth-options" | "form";

type AuthOnboardingViewProps = {
  onAuthenticated: () => void;
};

const inputBaseClass =
  "w-full rounded-[18px] border border-[#d6e2d7] bg-[#f4f7f3] px-4 py-3 pl-11 font-['Manrope',sans-serif] text-[14px] text-[#173124] placeholder:text-[#6f7e73] transition-all duration-200 focus:border-[#173124] focus:bg-white focus:shadow-[0_0_0_4px_rgba(23,49,36,0.1)] focus:outline-none";

const roleConfig = {
  parent: {
    label: "Parent",
    subtitle: "Caregiver access",
    description: "Manage your child's growth and nutrition",
    icon: UserRound,
    tone: "from-[#142e20] via-[#1a3827] to-[#29523b]",
    chip: "bg-[#e4efe2] text-[#173124]",
  },
  healthcare: {
    label: "Healthcare Worker",
    subtitle: "Clinical access",
    description: "Monitor and manage child health records",
    icon: Stethoscope,
    tone: "from-[#11271b] via-[#173424] to-[#254b37]",
    chip: "bg-[#e4efe2] text-[#173124]",
  },
} as const;

/* Topographic Contour Overlay for visual depth matching reference motif */
const ContourPattern = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.14] pointer-events-none"
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M-50 70 Q100 10 250 80 T500 30"
      stroke="#cae8c9"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M-30 110 Q120 50 270 120 T520 70"
      stroke="#cae8c9"
      strokeWidth="1.2"
      fill="none"
    />
    <path
      d="M-60 150 Q90 90 240 160 T480 110"
      stroke="#cae8c9"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M-40 190 Q140 130 290 200 T530 150"
      stroke="#cae8c9"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M-20 230 Q110 170 260 240 T500 190"
      stroke="#cae8c9"
      strokeWidth="1.5"
      fill="none"
    />
    <ellipse cx="330" cy="65" rx="85" ry="45" stroke="#cae8c9" strokeWidth="1.2" fill="none" transform="rotate(-15 330 65)" />
    <ellipse cx="330" cy="65" rx="55" ry="28" stroke="#cae8c9" strokeWidth="1" fill="none" transform="rotate(-15 330 65)" />
    <ellipse cx="330" cy="65" rx="25" ry="12" stroke="#cae8c9" strokeWidth="0.8" fill="none" transform="rotate(-15 330 65)" />

    <ellipse cx="75" cy="180" rx="100" ry="55" stroke="#cae8c9" strokeWidth="1.2" fill="none" transform="rotate(12 75 180)" />
    <ellipse cx="75" cy="180" rx="68" ry="36" stroke="#cae8c9" strokeWidth="1" fill="none" transform="rotate(12 75 180)" />
    <ellipse cx="75" cy="180" rx="35" ry="18" stroke="#cae8c9" strokeWidth="0.8" fill="none" transform="rotate(12 75 180)" />
  </svg>
);

/* Smooth Organic Wave Divider connecting green header and cream body edge-to-edge */
const OrganicWaveDivider = () => (
  <svg
    className="relative z-10 block w-full h-10 sm:h-12 -mb-[1px] text-[#faf7f2]"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,50 C280,110 550,15 850,75 C1020,105 1130,45 1200,35 L1200,120 L0,120 Z"
      fill="currentColor"
    />
  </svg>
);

export function AuthOnboardingView({ onAuthenticated }: AuthOnboardingViewProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({ main: false, confirm: false });
  const [formData, setFormData] = useState({
    childName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    childId: "",
    name: "",
    hospitalId: "",
  });

  const activeRole = selectedRole ? roleConfig[selectedRole] : null;

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (error) setError(null);
  };

  const handleRoleSelect = (role: AuthRole) => {
    setDirection(1);
    setSelectedRole(role);
    setMode("signin");
    setScreen("auth-options");
    setError(null);
  };

  const handleModeSelect = (nextMode: AuthMode) => {
    setDirection(1);
    setMode(nextMode);
    setScreen("form");
    setError(null);
  };

  const handleBack = () => {
    setDirection(-1);
    if (screen === "form") {
      setScreen("auth-options");
      return;
    }

    if (screen === "auth-options") {
      setSelectedRole(null);
      setScreen("welcome");
      return;
    }
  };

  const validateForm = (): string | null => {
    if (!selectedRole) return "Please choose a role to continue.";

    if (mode === "signup") {
      if (selectedRole === "parent") {
        if (!formData.childName.trim()) return "Please enter your child's name.";
        if (!formData.dob.trim()) return "Please enter your child's date of birth.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Please enter a valid email address.";
        if (!formData.password.trim()) return "Please create a password.";
        if (formData.password.length < 8) return "Password must be at least 8 characters long.";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
      } else {
        if (!formData.name.trim()) return "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Please enter a valid email address.";
        if (!formData.hospitalId.trim()) return "Please enter your hospital ID.";
        if (!formData.password.trim()) return "Please create a password.";
        if (formData.password.length < 8) return "Password must be at least 8 characters long.";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
      }
    } else {
      if (selectedRole === "parent") {
        if (!formData.childId.trim()) return "Please enter your child ID.";
      } else if (!formData.hospitalId.trim()) {
        return "Please enter your hospital ID.";
      }

      if (!formData.password.trim()) return "Please enter your password.";
    }

    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    onAuthenticated();
  };

  const fieldLabelClass =
    "mb-1.5 block font-['Space_Grotesk',sans-serif] text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#2d4739]";

  const renderWelcomeScreen = () => (
    <div className="w-full max-w-[410px] mx-auto">
      {/* SINGLE COHESIVE ROUNDED CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[36px] border border-[#d2e0d3] bg-[#faf7f2] shadow-[0_24px_60px_-15px_rgba(19,42,31,0.22),0_8px_20px_-6px_rgba(19,42,31,0.1)]"
      >
        {/* GREEN WELCOME AREA (TOP) - NO HORIZONTAL PADDING ON CONTAINER SO WAVE IS FULL WIDTH */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#122b1e] via-[#173124] to-[#254d36] pt-6 text-[#f6fbf7]">
          {/* Topographic Contour Overlay */}
          <ContourPattern />
          {/* Subtle Glow Accents */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#cae8c9]/15 blur-2xl pointer-events-none" />
          <div className="absolute right-0 top-1/3 h-24 w-24 rounded-full bg-[#c0e862]/10 blur-xl pointer-events-none" />

          {/* INNER TEXT WRAPPER WITH PADDING */}
          <div className="relative z-10 px-6">
            {/* POSHANEYE Branding Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#cae8c9]/30 bg-white/10 px-3 py-1 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#c0e862]" />
                <span className="font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.22em] text-[#edf6ee]">
                  POSHANEYE
                </span>
              </div>
            </div>

            {/* Welcome Text Content */}
            <div className="mt-5 pb-2">
              <h1 className="font-['Sora',sans-serif] text-[2.5rem] sm:text-[2.75rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#f6fbf7]">
                Welcome
              </h1>
              <p className="mt-2.5 max-w-[260px] font-['Manrope',sans-serif] text-[13px] leading-[1.48] text-[#d6e5d8]">
                Continue with the role that matches your journey and keep every child milestone in view.
              </p>
            </div>
          </div>

          {/* Organic Wave Visual Transition - Full Edge to Edge */}
          <OrganicWaveDivider />
        </div>

        {/* CREAM ROLE SELECTION AREA (BOTTOM - INSIDE SAME CONTAINER) */}
        <div className="relative bg-[#faf7f2] px-5 sm:px-6 pb-6 pt-1">
          <div className="mb-3.5">
            <p className="font-['Space_Grotesk',sans-serif] text-[10px] font-bold uppercase tracking-[0.22em] text-[#51665e]">
              CHOOSE YOUR ACCESS
            </p>
            <h2 className="mt-1 font-['Sora',sans-serif] text-[1.75rem] font-bold tracking-[-0.04em] text-[#173124]">
              Who are you?
            </h2>
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = selectedRole === key;

              return (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => handleRoleSelect(key as AuthRole)}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className={`group relative flex w-full items-center gap-3.5 overflow-hidden rounded-[22px] border p-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#173124] bg-[#edf5ec] shadow-[0_10px_22px_rgba(23,49,36,0.1)]"
                      : "border-[#d8e4d7] bg-[#f2f6f1] hover:border-[#a8c4ab] hover:bg-[#eef4ed]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br ${config.tone} text-[#f4faf3] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`inline-flex items-center rounded-full ${config.chip} px-2 py-0.5 font-['Space_Grotesk',sans-serif] text-[8.5px] font-bold uppercase tracking-[0.18em]`}
                    >
                      {config.subtitle}
                    </div>
                    <h3 className="mt-1 font-['Sora',sans-serif] text-[1.2rem] font-bold tracking-[-0.03em] text-[#173124]">
                      {config.label}
                    </h3>
                    <p className="mt-0.5 font-['Manrope',sans-serif] text-[12px] leading-[1.35] text-[#526359]">
                      {config.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                      isSelected
                        ? "bg-[#173124] text-white"
                        : "bg-[#dce6dc] text-[#173124] group-hover:bg-[#173124] group-hover:text-white"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAuthOptionsScreen = () => {
    const roleName = activeRole?.label ?? "Role";
    return (
      <div className="w-full max-w-[410px] mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="mb-3 inline-flex items-center gap-1.5 font-['Manrope',sans-serif] text-xs font-bold text-[#2d4739] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to roles
        </button>

        {/* SINGLE COHESIVE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: direction * 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[36px] border border-[#d2e0d3] bg-[#faf7f2] shadow-[0_24px_60px_-15px_rgba(19,42,31,0.22),0_8px_20px_-6px_rgba(19,42,31,0.1)]"
        >
          {/* GREEN HEADER AREA */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#122b1e] via-[#173124] to-[#254d36] pt-6 text-[#f6fbf7]">
            <ContourPattern />
            <div className="relative z-10 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cae8c9]/30 bg-white/10 px-2.5 py-0.5 font-['Space_Grotesk',sans-serif] text-[9px] font-bold uppercase tracking-[0.2em] text-[#d6efd4]">
                    {roleName} Access
                  </span>
                  <h2 className="mt-3 font-['Sora',sans-serif] text-[2.1rem] font-extrabold tracking-[-0.05em]">
                    {roleName}
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                  {activeRole && (() => {
                    const Icon = activeRole.icon;
                    return <Icon className="h-6 w-6 text-[#f4faf3]" />;
                  })()}
                </div>
              </div>
              <p className="mt-2 pb-2 font-['Manrope',sans-serif] text-[13px] leading-[1.45] text-[#d6e5d8]">
                Choose how you would like to continue with your PoshanEye account.
              </p>
            </div>
            <OrganicWaveDivider />
          </div>

          {/* CREAM LOWER AREA */}
          <div className="relative bg-[#faf7f2] px-5 sm:px-6 pb-6 pt-1">
            <div className="space-y-3">
              {(["signin", "signup"] as AuthMode[]).map((option) => {
                const isSelected = mode === option;
                const optionTitle = option === "signin" ? "Sign In" : "Create Account";
                const optionSub = option === "signin" ? "Existing account login" : "Register new account";

                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleModeSelect(option)}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    className={`group flex w-full items-center justify-between rounded-[22px] border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#173124] bg-[#edf5ec] shadow-[0_10px_22px_rgba(23,49,36,0.1)]"
                        : "border-[#d8e4d7] bg-[#f2f6f1] hover:border-[#a8c4ab] hover:bg-[#eef4ed]"
                    }`}
                  >
                    <div>
                      <span className="font-['Space_Grotesk',sans-serif] text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#51665e]">
                        {option === "signin" ? "Existing" : "New"}
                      </span>
                      <h3 className="mt-0.5 font-['Sora',sans-serif] text-[1.35rem] font-bold tracking-[-0.03em] text-[#173124]">
                        {optionTitle}
                      </h3>
                      <p className="mt-0.5 font-['Manrope',sans-serif] text-[12px] text-[#526359]">
                        {optionSub}
                      </p>
                    </div>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
                        isSelected
                          ? "bg-[#173124] text-white"
                          : "bg-[#dce6dc] text-[#173124] group-hover:bg-[#173124] group-hover:text-white"
                      }`}
                    >
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderFormScreen = () => {
    const isParent = selectedRole === "parent";
    const isSignUp = mode === "signup";
    const title = isSignUp
      ? isParent
        ? "Create Account"
        : "Join Clinician"
      : isParent
      ? "Welcome Back"
      : "Clinical Sign In";

    const subtitle = isSignUp
      ? isParent
        ? "Set up your family account and track child growth."
        : "Create a protected workspace for clinical monitoring."
      : isParent
      ? "Sign in to view growth insights & nutrition status."
      : "Sign in to access patient & child health records.";

    const renderField = (
      label: string,
      name: keyof typeof formData,
      type = "text",
      placeholder = "",
      icon?: React.ReactNode,
      showToggle?: boolean,
    ) => (
      <div key={name}>
        <label className={fieldLabelClass} htmlFor={name}>
          {label}
        </label>
        <div className="relative">
          <input
            id={name}
            type={
              showToggle && (name === "password" || name === "confirmPassword")
                ? showPassword[name === "password" ? "main" : "confirm"]
                  ? "text"
                  : "password"
                : type
            }
            value={formData[name]}
            onChange={(event) => updateField(name, event.target.value)}
            placeholder={placeholder}
            className={`${inputBaseClass} ${showToggle ? "pr-11" : ""}`}
          />
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#51665e]">
              {icon}
            </div>
          )}
          {showToggle && (
            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => ({
                  ...current,
                  [name === "password" ? "main" : "confirm"]:
                    !current[name === "password" ? "main" : "confirm"],
                }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#173124] transition-colors hover:bg-[#e4efe2]"
              aria-label={
                showPassword[name === "password" ? "main" : "confirm"]
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword[name === "password" ? "main" : "confirm"] ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );

    return (
      <div className="w-full max-w-[410px] mx-auto">
        <button
          type="button"
          onClick={handleBack}
          className="mb-3 inline-flex items-center gap-1.5 font-['Manrope',sans-serif] text-xs font-bold text-[#2d4739] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        {/* SINGLE COHESIVE CONTAINER */}
        <motion.div
          initial={{ opacity: 0, x: direction * 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[36px] border border-[#d2e0d3] bg-[#faf7f2] shadow-[0_24px_60px_-15px_rgba(19,42,31,0.22),0_8px_20px_-6px_rgba(19,42,31,0.1)]"
        >
          {/* GREEN HEADER AREA */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#122b1e] via-[#173124] to-[#254d36] pt-6 text-[#f6fbf7]">
            <ContourPattern />
            <div className="relative z-10 px-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#cae8c9]/30 bg-white/10 px-2.5 py-0.5 backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#c0e862]" />
                  <span className="font-['Space_Grotesk',sans-serif] text-[9px] font-bold uppercase tracking-[0.22em] text-[#edf6ee]">
                    {isParent ? "Parent Access" : "Clinical Access"}
                  </span>
                </div>
              </div>
              <div className="mt-3 pb-2">
                <h2 className="font-['Sora',sans-serif] text-[1.95rem] font-extrabold tracking-[-0.05em] text-[#f6fbf7]">
                  {title}
                </h2>
                <p className="mt-1.5 font-['Manrope',sans-serif] text-[13px] leading-[1.45] text-[#d6e5d8]">
                  {subtitle}
                </p>
              </div>
            </div>
            <OrganicWaveDivider />
          </div>

          {/* CREAM FORM AREA */}
          <form onSubmit={handleSubmit} className="relative bg-[#faf7f2] space-y-4 px-5 sm:px-6 pb-6 pt-1">
            {isParent && isSignUp ? (
              <>
                {renderField("Child Name", "childName", "text", "Aarav", <UserRound className="h-4 w-4" />)}
                {renderField("Date of Birth", "dob", "date", "", <Calendar className="h-4 w-4" />)}
                {renderField("Email", "email", "email", "hello@poshaneye.com", <Mail className="h-4 w-4" />)}
                {renderField("Password", "password", "password", "Min 8 characters", <Lock className="h-4 w-4" />, true)}
                {renderField("Confirm Password", "confirmPassword", "password", "Repeat password", <Lock className="h-4 w-4" />, true)}
              </>
            ) : isParent ? (
              <>
                {renderField("Child ID", "childId", "text", "e.g. PE-1048", <ShieldCheck className="h-4 w-4" />)}
                {renderField("Password", "password", "password", "Enter password", <Lock className="h-4 w-4" />, true)}
              </>
            ) : isSignUp ? (
              <>
                {renderField("Name", "name", "text", "Dr. Priya Nair", <UserRound className="h-4 w-4" />)}
                {renderField("Email", "email", "email", "doctor@hospital.org", <Mail className="h-4 w-4" />)}
                {renderField("Hospital ID", "hospitalId", "text", "HID-2341", <Building2 className="h-4 w-4" />)}
                {renderField("Password", "password", "password", "Min 8 characters", <Lock className="h-4 w-4" />, true)}
                {renderField("Confirm Password", "confirmPassword", "password", "Repeat password", <Lock className="h-4 w-4" />, true)}
              </>
            ) : (
              <>
                {renderField("Hospital ID", "hospitalId", "text", "e.g. HID-2341", <Building2 className="h-4 w-4" />)}
                {renderField("Password", "password", "password", "Enter password", <Lock className="h-4 w-4" />, true)}
              </>
            )}

            {error && (
              <div className="rounded-[16px] border border-[#f0d2d2] bg-[#fff4f2] px-3.5 py-2 font-['Manrope',sans-serif] text-xs font-bold text-[#a54f47]">
                {error}
              </div>
            )}

            <div className="pt-1">
              {/* Sign In / Sign Up Toggle Pill */}
              <div className="mb-3 flex rounded-full border border-[#d6e2d7] bg-[#eef4ed] p-1">
                {(["signin", "signup"] as AuthMode[]).map((option) => {
                  const isActive = mode === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMode(option)}
                      className={`flex-1 rounded-full py-1.5 font-['Manrope',sans-serif] text-xs font-extrabold transition-all duration-200 ${
                        isActive
                          ? "bg-[#173124] text-white shadow-[0_4px_12px_rgba(23,49,36,0.2)]"
                          : "text-[#2d4739] hover:text-[#173124]"
                      }`}
                    >
                      {option === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#173124] px-5 py-3.5 font-['Manrope',sans-serif] text-sm font-extrabold text-[#f6fbf9] shadow-[0_14px_28px_rgba(23,49,36,0.2)] transition-colors hover:bg-[#214a39]"
              >
                {isSignUp ? "Create account" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };


  return (
    <div className="auth-shell min-h-screen w-full flex items-center justify-center px-4 py-6 sm:py-10 text-[#173124]">
      {screen === "welcome" && renderWelcomeScreen()}
      {screen === "auth-options" && selectedRole && renderAuthOptionsScreen()}
      {screen === "form" && selectedRole && renderFormScreen()}
    </div>
  );
}
