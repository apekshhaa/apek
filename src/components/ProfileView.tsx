import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import { Edit2, Baby, Bell, Sliders, ChevronRight, HelpCircle, ShieldCheck, User } from "lucide-react";

interface ProfileViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  child,
  isDarkMode = false,
}) => {
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 2500);
  };

  return (
    <div className="flex flex-col w-full relative pt-20 pb-32 px-5 max-w-lg mx-auto">
      {/* Toast Popup */}
      {showNotificationToast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 animate-fade-in ${
          isDarkMode ? "bg-[#3fff80] text-[#0a120e]" : "bg-[#173124] text-white"
        }`}>
          {toastMessage}
        </div>
      )}

      {/* Parent & Child Profile Header */}
      <section className={`flex items-center gap-4 rounded-3xl p-4 mb-6 border transition-colors ${
        isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]"
      }`}>
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center shrink-0 ring-2 ${
          isDarkMode ? "bg-[#3fff80] text-[#0a120e] ring-[#3fff80]/40" : "bg-[#173124] text-[#faf9f5] ring-[#cceacc]"
        }`}>
          <User className="w-8 h-8" />
        </div>
        <div className="flex flex-col flex-grow min-w-0">
          <h2 className={`text-xl font-bold truncate ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>
            {child.parentNames}
          </h2>
          <p className={`text-xs truncate ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>
            {child.accountType}
          </p>
        </div>
        <button
          onClick={() => triggerToast("Profile details updated")}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 border ${
            isDarkMode
              ? "bg-[#1f3829] text-[#3fff80] border-[#294a36] hover:bg-[#294a36]"
              : "bg-[#e9e8e4] text-[#1b1c1a] border-transparent hover:bg-[#e3e2df]"
          }`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </section>

      {/* Child Overview Badge */}
      <section className={`rounded-2xl p-4 mb-6 flex items-center gap-4 border transition-colors ${
        isDarkMode ? "bg-[#122b1f] border-[#224432] text-[#ffffff]" : "bg-[#cae8c9] border-transparent text-[#07200e]"
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-white/60 text-[#173124]"
        }`}>
          <Baby className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`font-bold text-base ${isDarkMode ? "text-[#ffffff]" : "text-[#173124]"}`}>{child.name}</h3>
          <p className={`text-xs ${isDarkMode ? "text-[#b0c4b5]" : "text-[#4f6951]"}`}>
            {child.ageYears}y {child.ageMonths}m • {child.gender === "boy" ? "Male" : "Female"} • {child.status}
          </p>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="space-y-6">
        {/* PREFERENCES */}
        <section className="space-y-2">
          <h3 className={`text-xs font-bold uppercase tracking-widest pl-1 ${
            isDarkMode ? "text-[#3fff80]" : "text-[#2d4739]"
          }`}>
            Preferences
          </h3>
          <div className={`rounded-3xl overflow-hidden flex flex-col border transition-colors ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]"
          }`}>
            <button
              onClick={() => triggerToast("Notifications enabled")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left group ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#e9e8e4]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>Notifications</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#e3e2df]"}`} />

            <button
              onClick={() => triggerToast("App settings opened")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left group ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#e9e8e4]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
                }`}>
                  <Sliders className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>App Settings</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#e3e2df]"}`} />

            <button
              onClick={() => triggerToast("Managing child profiles")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left group ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#e9e8e4]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#cae8c9] text-[#4f6951]"
                }`}>
                  <Baby className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>Manage Profiles</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="space-y-2">
          <h3 className={`text-xs font-bold uppercase tracking-widest pl-1 ${
            isDarkMode ? "text-[#3fff80]" : "text-[#2d4739]"
          }`}>
            Support
          </h3>
          <div className={`rounded-3xl overflow-hidden flex flex-col border transition-colors ${
            isDarkMode ? "bg-[#14231b] border-[#22392b]" : "bg-[#efeeea] border-[#e3e2df]"
          }`}>
            <button
              onClick={() => triggerToast("Help Center loaded")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left group ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#e9e8e4]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#faf9f5] text-[#424844]"
                }`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>Help Center</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>

            <div className={`h-px mx-4 ${isDarkMode ? "bg-[#22392b]" : "bg-[#e3e2df]"}`} />

            <button
              onClick={() => triggerToast("Privacy & Security verified")}
              className={`flex items-center justify-between p-4 transition-colors w-full text-left group ${
                isDarkMode ? "hover:bg-[#1a2e23]" : "hover:bg-[#e9e8e4]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? "bg-[#1f3829] text-[#3fff80]" : "bg-[#faf9f5] text-[#424844]"
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${isDarkMode ? "text-[#ffffff]" : "text-[#1b1c1a]"}`}>Privacy & Security</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-[#b0c4b5]" : "text-[#727973]"}`} />
            </button>
          </div>
        </section>
      </div>

      {/* Logout */}
      <div className="pt-8 flex justify-center pb-4">
        <button
          onClick={() => triggerToast("Signed out safely")}
          className={`px-8 py-3 rounded-full border text-sm font-bold transition-all ${
            isDarkMode
              ? "border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
              : "border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]"
          }`}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
