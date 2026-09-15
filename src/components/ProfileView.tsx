import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import {
  ChevronLeft,
  MoreVertical,
  Play,
  Pause,
  Send,
  ChevronRight,
  Star,
  User,
  Baby,
  Edit2,
  Bell,
  Sliders,
  HelpCircle,
  ShieldCheck,
  Activity,
  X,
  Sparkles,
  Moon,
  Sun
} from "lucide-react";

interface ProfileViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onBackClick?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  child,
  vitals,
  isDarkMode = false,
  onToggleTheme,
  onBackClick,
}) => {
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Editable state for child profile
  const [currentChild, setCurrentChild] = useState<ChildProfile>({
    ...child,
    name: child.name || "Aarav Chen",
  });

  const [editFormData, setEditFormData] = useState({
    name: currentChild.name,
    parentNames: currentChild.parentNames,
    ageYears: currentChild.ageYears,
    ageMonths: currentChild.ageMonths,
    gender: currentChild.gender,
    status: currentChild.status,
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentChild({
      ...currentChild,
      ...editFormData,
    });
    setIsEditModalOpen(false);
    triggerToast("Child profile updated successfully!");
  };

  return (
    <div className="flex flex-col w-full relative pt-2 pb-32 px-5 max-w-lg mx-auto gap-5 font-['Geist',sans-serif]">
      {/* Toast Popup Notification */}
      {showNotificationToast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 font-['Manrope',sans-serif] text-xs font-bold px-4 py-2.5 rounded-full shadow-xl z-50 animate-fade-in flex items-center gap-2 ${
          isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#0d0e0d] text-white"
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Floating Control Buttons */}
      <div className="flex items-center justify-between w-full z-30 pt-1">
        <button
          onClick={onBackClick || (() => triggerToast("Navigated back"))}
          className={`w-10 h-10 rounded-full shadow-md border flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] text-white"
              : "bg-white border-slate-200/80 text-slate-800"
          }`}
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`w-10 h-10 rounded-full shadow-md border flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
                isDarkMode
                  ? "bg-[#14231b] border-[#22392b] text-[#3fff80]"
                  : "bg-white border-slate-200/80 text-[#173124]"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setIsEditModalOpen(true)}
            className={`w-10 h-10 rounded-full shadow-md border flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
              isDarkMode
                ? "bg-[#14231b] border-[#22392b] text-white"
                : "bg-white border-slate-200/80 text-slate-800"
            }`}
            aria-label="Profile Settings Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Section (Clean Background without Green Blob) */}
      <div className="relative w-full flex flex-col items-center justify-center pt-2 pb-2">
        {/* Floating Star Rating / Growth Score Badge */}
        <div className={`absolute top-2 right-2 sm:right-6 z-20 shadow-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold border transition-all ${
          isDarkMode
            ? "bg-[#14231b] text-white border-[#22392b]"
            : "bg-[#0d0e0d] text-white border-black/10"
        }`}>
          <span className="font-extrabold text-xs">4.9</span>
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-slate-400 dark:text-[#a8b8ac] font-medium text-[11px]">(128)</span>
        </div>

        {/* Child Portrait Image Cut-out Container */}
        <div className="relative w-48 h-56 mx-auto flex items-end justify-center z-10">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600"
            alt={currentChild.name}
            className="w-full h-full object-cover object-top rounded-3xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          {/* Subtle gradient overlay at bottom of photo */}
          <div className={`absolute inset-x-0 bottom-0 h-16 rounded-b-3xl bg-gradient-to-t pointer-events-none ${
            isDarkMode
              ? "from-[#0a120e]/90 via-[#0a120e]/40 to-transparent"
              : "from-[#faf9f5]/90 via-[#faf9f5]/40 to-transparent"
          }`} />
        </div>

        {/* Child Name & Subtitles */}
        <div className="flex flex-col items-center text-center mt-3 z-10 space-y-1">
          <h1 className={`font-['Sora',sans-serif] text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isDarkMode ? "text-white" : "text-[#0d0e0d]"
          }`}>
            {currentChild.name}
          </h1>
          
          <h2 className={`font-['Sora',sans-serif] text-sm sm:text-base font-bold tracking-wide ${
            isDarkMode ? "text-[#3fff80]" : "text-[#86bf15]"
          }`}>
            Running Coach
          </h2>

          {/* Leaf Tag Pill */}
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border shadow-xs text-xs font-semibold mt-1 transition-all ${
            isDarkMode
              ? "bg-[#14231b] border-[#22392b] text-[#b0c4b5]"
              : "bg-white border-slate-200/80 text-[#424844]"
          }`}>
            <span className="text-emerald-500 text-sm">🍃</span>
            <span>{currentChild.status || "Beginner friendly"}</span>
          </div>
        </div>
      </div>

      {/* Audio Waveform Player Card */}
      <div className={`w-full rounded-3xl p-3.5 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3.5 transition-all ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"
      }`}>
        <button
          onClick={() => {
            setIsAudioPlaying(!isAudioPlaying);
            triggerToast(isAudioPlaying ? "Audio note paused" : "Playing voice growth update");
          }}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md ${
            isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#c5f82a] text-[#0d0e0d]"
          }`}
          aria-label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
        >
          {isAudioPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Animated Soundwave Equalizer Bars */}
            <div className="flex items-center gap-0.5 h-5 overflow-hidden">
              {[40, 75, 50, 90, 60, 100, 45, 80, 55, 95, 70, 40, 85, 60, 30].map((h, idx) => (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-all duration-300 ${
                    isAudioPlaying
                      ? "bg-[#86bf15] dark:bg-[#3fff80] animate-pulse"
                      : idx < 9
                      ? isDarkMode
                        ? "bg-[#3fff80]"
                        : "bg-[#173124]"
                      : isDarkMode
                      ? "bg-[#294a36]"
                      : "bg-[#d3d2ce]"
                  }`}
                  style={{
                    height: isAudioPlaying ? `${Math.max(25, (h * ((idx % 3) + 1)) % 100)}%` : `${h}%`,
                    animationDelay: `${idx * 0.08}s`,
                  }}
                />
              ))}
            </div>
            <span className={`text-xs font-bold font-['Space_Grotesk'] ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
            }`}>
              2:15
            </span>
          </div>
          <span className={`text-xs font-semibold tracking-tight mt-0.5 truncate ${
            isDarkMode ? "text-white" : "text-[#173124]"
          }`}>
            Pre-Run Mindset
          </span>
        </div>

        {/* Caregiver Avatars Stack with +96 badge */}
        <div className="flex items-center -space-x-2 shrink-0">
          <img
            className="w-7 h-7 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
            alt="Caregiver 1"
          />
          <img
            className="w-7 h-7 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
            alt="Caregiver 2"
          />
          <img
            className="w-7 h-7 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
            alt="Caregiver 3"
          />
          <div className={`w-7 h-7 rounded-full border-2 border-white dark:border-[#14231b] font-bold text-[10px] flex items-center justify-center ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#efeeea] text-[#173124]"
          }`}>
            +96
          </div>
        </div>
      </div>

      {/* Dual Action Buttons */}
      <div className="flex items-center gap-3 w-full">
        {/* Primary Dark Button with Vibrant Yellow-Green Text */}
        <button
          onClick={() => triggerToast("Booking session...")}
          className={`flex-1 py-4 px-5 rounded-2xl font-['Sora',sans-serif] font-bold text-sm transition-all shadow-md active:scale-95 text-center ${
            isDarkMode
              ? "bg-[#173124] text-[#3fff80] hover:bg-[#1f3829] border border-[#2d4739]"
              : "bg-[#0d0e0d] text-[#c5f82a] hover:bg-[#1d201d]"
          }`}
        >
          Book session
        </button>

        {/* Secondary White/Light Button with Send Icon */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className={`flex-1 py-4 px-5 rounded-2xl font-['Sora',sans-serif] font-bold text-sm transition-all border shadow-xs active:scale-95 flex items-center justify-center gap-2 ${
            isDarkMode
              ? "bg-[#14231b] text-white border-[#22392b] hover:bg-[#1a2e23]"
              : "bg-white text-[#0d0e0d] border-[#e3e2df] hover:bg-[#f9f8f5]"
          }`}
        >
          <Send className="w-4 h-4 text-[#86bf15] dark:text-[#3fff80]" />
          <span>Message {currentChild.name.split(" ")[0]}</span>
        </button>
      </div>

      {/* Community / Care Network Card */}
      <div
        onClick={() => triggerToast("Opening City Runners Community...")}
        className={`w-full rounded-3xl p-4 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
          isDarkMode
            ? "bg-[#14231b] border-[#22392b] hover:bg-[#1a2e23]"
            : "bg-white border-[#e3e2df] hover:bg-[#f9f8f5]"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="flex items-center -space-x-2 shrink-0">
            <img
              className="w-8 h-8 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
              alt="Community Member 1"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
              alt="Community Member 2"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white dark:border-[#14231b] object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
              alt="Community Member 3"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-['Sora',sans-serif] text-sm font-bold ${
              isDarkMode ? "text-white" : "text-[#0d0e0d]"
            }`}>
              City Runners Community
            </span>
            <span className={`font-['Manrope',sans-serif] text-xs ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"
            }`}>
              1.2K members
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
      </div>

      {/* Vitals Summary Snapshot Card */}
      <div className={`w-full rounded-3xl p-5 border shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5 transition-all ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isDarkMode ? "text-[#3fff80]" : "text-[#173124]"}`} />
            <h3 className={`font-['Sora',sans-serif] text-base font-bold ${
              isDarkMode ? "text-white" : "text-[#173124]"
            }`}>
              Vitals Overview
            </h3>
          </div>
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
            isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
          }`}>
            {vitals.date || "Updated 2d ago"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 rounded-2xl text-center border ${
            isDarkMode ? "bg-[#0a120e]/60 border-[#22392b]" : "bg-[#faf9f5] border-[#e8e7e3]"
          }`}>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
            }`}>
              Weight
            </span>
            <span className={`font-['Sora',sans-serif] text-base sm:text-lg font-bold mt-0.5 block ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              {vitals.weight} <span className="text-xs font-normal">kg</span>
            </span>
          </div>

          <div className={`p-3 rounded-2xl text-center border ${
            isDarkMode ? "bg-[#0a120e]/60 border-[#22392b]" : "bg-[#faf9f5] border-[#e8e7e3]"
          }`}>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
            }`}>
              Height
            </span>
            <span className={`font-['Sora',sans-serif] text-base sm:text-lg font-bold mt-0.5 block ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              {vitals.height} <span className="text-xs font-normal">cm</span>
            </span>
          </div>

          <div className={`p-3 rounded-2xl text-center border ${
            isDarkMode ? "bg-[#0a120e]/60 border-[#22392b]" : "bg-[#faf9f5] border-[#e8e7e3]"
          }`}>
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${
              isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]"
            }`}>
              MUAC
            </span>
            <span className={`font-['Sora',sans-serif] text-base sm:text-lg font-bold mt-0.5 block ${
              isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
            }`}>
              {vitals.muac} <span className="text-xs font-normal">cm</span>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Options Groups */}
      <div className="space-y-4 pt-1">
        {/* PREFERENCES */}
        <section className="space-y-2">
          <h3 className={`font-['Space_Grotesk',sans-serif] text-[11px] font-bold uppercase tracking-[2px] pl-1 ${
            isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
          }`}>
            Preferences & Controls
          </h3>

          <div className={`rounded-3xl overflow-hidden flex flex-col border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"
          }`}>
            {/* Edit Profile */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#f9f8f5]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-['Manrope',sans-serif] text-sm font-bold ${
                    isDarkMode ? "text-white" : "text-[#1b1c1a]"
                  }`}>
                    Child Details & Guardians
                  </span>
                  <span className={`text-xs ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`}>
                    {currentChild.parentNames} • {currentChild.accountType}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#efeeea]"}`} />

            {/* Notifications */}
            <button
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                triggerToast(notificationsEnabled ? "Notifications muted" : "Notifications enabled");
              }}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#f9f8f5]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-['Manrope',sans-serif] text-sm font-bold ${
                    isDarkMode ? "text-white" : "text-[#1b1c1a]"
                  }`}>
                    Growth Reminders & Alerts
                  </span>
                  <span className={`text-xs ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`}>
                    {notificationsEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full p-1 transition-colors ${
                notificationsEnabled
                  ? isDarkMode ? "bg-[#3fff80]" : "bg-[#173124]"
                  : isDarkMode ? "bg-[#22392b]" : "bg-[#e3e2df]"
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`} />
              </div>
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#efeeea]"}`} />

            {/* Manage Profiles */}
            <button
              onClick={() => triggerToast("Manage profiles section")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#f9f8f5]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <Baby className="w-5 h-5" />
                </div>
                <span className={`font-['Manrope',sans-serif] text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-[#1b1c1a]"
                }`}>
                  Manage Multiple Profiles
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="space-y-2">
          <h3 className={`font-['Space_Grotesk',sans-serif] text-[11px] font-bold uppercase tracking-[2px] pl-1 ${
            isDarkMode ? "text-[#3fff80]" : "text-[#173124]"
          }`}>
            Support & Privacy
          </h3>

          <div className={`rounded-3xl overflow-hidden flex flex-col border shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-white border-[#e3e2df]"
          }`}>
            <button
              onClick={() => triggerToast("Help Center loaded")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#f9f8f5]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className={`font-['Manrope',sans-serif] text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-[#1b1c1a]"
                }`}>
                  Help & Pediatric Support
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#efeeea]"}`} />

            <button
              onClick={() => triggerToast("Privacy & Security verified")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#f9f8f5]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#173124]"
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className={`font-['Manrope',sans-serif] text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-[#1b1c1a]"
                }`}>
                  Privacy & Data Security
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>
          </div>
        </section>
      </div>

      {/* Logout Action */}
      <div className="pt-2 flex justify-center pb-4">
        <button
          onClick={() => triggerToast("Signed out safely")}
          className={`font-['Manrope',sans-serif] px-8 py-3.5 rounded-full border text-sm font-bold active:scale-95 transition-all shadow-xs ${
            isDarkMode
              ? "border-[#ff6b6b]/40 text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
              : "border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]"
          }`}
        >
          Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
            isDarkMode ? "bg-[#14231b] border-[#22392b] text-white" : "bg-white border-slate-200 text-[#173124]"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-[#22392b]">
              <h3 className="font-['Sora',sans-serif] text-lg font-bold">Edit Child Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#1a2e23]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 font-['Manrope',sans-serif]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Child's Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-semibold outline-none transition-all ${
                    isDarkMode
                      ? "bg-[#0a120e] border-[#22392b] focus:border-[#3fff80] text-white"
                      : "bg-[#faf9f5] border-slate-200 focus:border-[#173124] text-slate-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Guardians / Parents
                </label>
                <input
                  type="text"
                  value={editFormData.parentNames}
                  onChange={(e) => setEditFormData({ ...editFormData, parentNames: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-semibold outline-none transition-all ${
                    isDarkMode
                      ? "bg-[#0a120e] border-[#22392b] focus:border-[#3fff80] text-white"
                      : "bg-[#faf9f5] border-slate-200 focus:border-[#173124] text-slate-900"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={editFormData.ageYears}
                    onChange={(e) => setEditFormData({ ...editFormData, ageYears: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-semibold outline-none ${
                      isDarkMode
                        ? "bg-[#0a120e] border-[#22392b] focus:border-[#3fff80] text-white"
                        : "bg-[#faf9f5] border-slate-200 focus:border-[#173124] text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                    Age (Months)
                  </label>
                  <input
                    type="number"
                    value={editFormData.ageMonths}
                    onChange={(e) => setEditFormData({ ...editFormData, ageMonths: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-semibold outline-none ${
                      isDarkMode
                        ? "bg-[#0a120e] border-[#22392b] focus:border-[#3fff80] text-white"
                        : "bg-[#faf9f5] border-slate-200 focus:border-[#173124] text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                  Growth Status / Tag
                </label>
                <input
                  type="text"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-semibold outline-none ${
                    isDarkMode
                      ? "bg-[#0a120e] border-[#22392b] focus:border-[#3fff80] text-white"
                      : "bg-[#faf9f5] border-slate-200 focus:border-[#173124] text-slate-900"
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold border ${
                    isDarkMode ? "border-[#22392b] text-white" : "border-slate-200 text-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold shadow-md ${
                    isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
