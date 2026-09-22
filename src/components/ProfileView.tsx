import React, { useState } from "react";
import { ChildProfile, VitalRecord } from "../types";
import {
  Bell,
  ChevronRight,
  Edit2,
  HelpCircle,
  ImagePlus,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

interface ProfileViewProps {
  child: ChildProfile;
  vitals: VitalRecord;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onBackClick?: () => void;
  onHistoryClick?: () => void;
}

type EditTarget = "child" | "parent" | null;
type RowItem = { label: string; icon: React.ComponentType<{ className?: string }> };

export const ProfileView: React.FC<ProfileViewProps> = ({ child, isDarkMode = false, onHistoryClick }) => {
  const [currentChild, setCurrentChild] = useState(child);
  const [parentName, setParentName] = useState(child.parentNames);
  const [accountType, setAccountType] = useState(child.accountType);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editName, setEditName] = useState(child.name);
  const [editAvatarUrl, setEditAvatarUrl] = useState(child.avatarUrl);
  const [editAge, setEditAge] = useState(`${child.ageYears}`);
  const [editGender, setEditGender] = useState(child.gender);
  const [editStatus, setEditStatus] = useState(child.status);
  const [editParentName, setEditParentName] = useState(child.parentNames);
  const [editAccountType, setEditAccountType] = useState(child.accountType);

  const ink = isDarkMode ? "text-white" : "text-[#173124]";
  const muted = isDarkMode ? "text-[#b0c4b5]" : "text-[#59625a]";
  const rule = isDarkMode ? "border-[#31553d]" : "border-[#d8ddd5]";
  const accent = isDarkMode ? "text-[#3fff80]" : "text-[#86bf15]";
  const profileTitleSize = currentChild.name.length > 22
    ? "clamp(2.4rem, 10vw, 4.8rem)"
    : currentChild.name.length > 14
      ? "clamp(2.8rem, 12vw, 5.4rem)"
      : "clamp(3.4rem, 15vw, 6.5rem)";

  const openEditor = (target: EditTarget) => {
    if (target === "child") {
      setEditName(currentChild.name);
      setEditAvatarUrl(currentChild.avatarUrl);
      setEditAge(`${currentChild.ageYears}`);
      setEditGender(currentChild.gender);
      setEditStatus(currentChild.status);
    } else {
      setEditParentName(parentName);
      setEditAccountType(accountType);
    }
    setEditTarget(target);
  };

  const saveEditor = (event: React.FormEvent) => {
    event.preventDefault();
    if (editTarget === "child") {
      setCurrentChild({ ...currentChild, name: editName, avatarUrl: editAvatarUrl, ageYears: Number(editAge) || currentChild.ageYears, gender: editGender, status: editStatus });
    } else {
      setParentName(editParentName);
      setAccountType(editAccountType);
    }
    setEditTarget(null);
  };

  const preferences: RowItem[] = [
    { label: "Notifications", icon: Bell },
    { label: "App Settings", icon: Settings },
    { label: "Manage Profiles", icon: Users },
  ];
  const support: RowItem[] = [
    { label: "Help Center", icon: HelpCircle },
    { label: "Privacy & Security", icon: ShieldCheck },
  ];

  return (
    <div className={`flex flex-col w-full max-w-lg mx-auto px-5 pb-32 font-['Geist',sans-serif] ${ink}`}>
      <section className="pt-2 pb-6">
        <div className="flex items-center justify-end mb-5">
          <span className={`font-['Space_Grotesk',sans-serif] text-[11px] ${muted}`}>POSHANEYE</span>
        </div>
        <h1 style={{ fontSize: profileTitleSize }} className="font-['Sora',sans-serif] leading-[0.86] font-extrabold tracking-[-0.07em] uppercase break-words">{currentChild.name}'s<br />profile</h1>
        <button type="button" onClick={onHistoryClick} className={`group mt-5 flex w-full justify-between border-t ${rule} pt-3 text-left font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[1.5px] ${muted}`}>
          <span>Child history</span><span className="transition-transform group-hover:translate-x-1">01—05 <ChevronRight className="ml-2 inline h-3.5 w-3.5" /></span>
        </button>
      </section>

      <EditorialSection index="01" label="Child profile" rule={rule} muted={muted}>
        <div className="grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-4 sm:gap-6 items-end">
          {currentChild.avatarUrl ? (
            <img src={currentChild.avatarUrl} alt={currentChild.name} className="w-full aspect-[0.82] object-cover rounded-[2px] grayscale-[12%] transition-all duration-500 hover:grayscale-0 hover:scale-[1.015]" />
          ) : (
            <div className={`w-full aspect-[0.82] flex flex-col items-center justify-center rounded-[2px] border ${isDarkMode ? "bg-[#14231b] border-[#31553d]" : "bg-[#f4f5ef] border-[#d8ddd5]"}`}>
              <ImagePlus className={`w-8 h-8 ${isDarkMode ? "text-[#3fff80]" : "text-[#6e8c75]"}`} />
              <span className={`mt-3 font-['Space_Grotesk',sans-serif] text-[10px] uppercase tracking-[1.5px] ${muted}`}>No photo</span>
            </div>
          )}
          <div className="pb-1">
            <div className="flex justify-between items-start gap-3">
              <h2 className="font-['Sora',sans-serif] text-[clamp(2rem,9vw,3.7rem)] leading-[0.9] font-bold tracking-[-0.06em] break-words">{currentChild.name}</h2>
              <EditButton onClick={() => openEditor("child")} label="Edit child profile" ink={ink} rule={rule} />
            </div>
            <div className={`mt-7 border-t ${rule} pt-3 space-y-3 font-['Manrope',sans-serif] text-sm`}>
              <DataLine label="Age" value={`${currentChild.ageYears} years${currentChild.ageMonths ? `, ${currentChild.ageMonths} months` : ""}`} muted={muted} />
              <DataLine label="Gender" value={currentChild.gender === "boy" ? "Boy" : "Girl"} muted={muted} />
              <DataLine label="Status" value={currentChild.status} muted={muted} accent={accent} />
            </div>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection index="02" label="Parent / account" rule={rule} muted={muted}>
        <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <h2 className="font-['Sora',sans-serif] text-[clamp(2rem,8vw,3.4rem)] leading-[0.92] font-bold tracking-[-0.06em]">{parentName}</h2>
            <p className={`mt-4 font-['Manrope',sans-serif] text-sm ${muted}`}>{accountType}</p>
          </div>
          <EditButton onClick={() => openEditor("parent")} label="Edit parent account" ink={ink} rule={rule} />
        </div>
      </EditorialSection>

      <EditorialSection index="03" label="Preferences" rule={rule} muted={muted}>
        <EditorialRows items={preferences} rule={rule} ink={ink} muted={muted} />
      </EditorialSection>

      <EditorialSection index="04" label="Support" rule={rule} muted={muted}>
        <EditorialRows items={support} rule={rule} ink={ink} muted={muted} />
      </EditorialSection>

      <section className={`border-t ${rule} pt-5 mt-2`}>
        <button className={`group w-full flex items-center justify-between text-left font-['Sora',sans-serif] text-2xl font-bold tracking-[-0.04em] transition-colors ${isDarkMode ? "hover:text-[#ff9b8f]" : "hover:text-[#a44c42]"}`}>
          <span><span className={`font-['Space_Grotesk',sans-serif] text-[11px] tracking-[1.5px] align-middle mr-4 ${muted}`}>05</span>Sign Out</span>
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </section>

      {editTarget && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0d0e0d]/40 p-5 sm:items-center">
          <form onSubmit={saveEditor} className={`w-full max-w-lg border ${rule} p-5 ${isDarkMode ? "bg-[#14231b]" : "bg-[#faf9f5]"}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-['Sora',sans-serif] text-lg font-semibold ${ink}`}>Edit {editTarget === "child" ? "child profile" : "parent account"}</h2>
              <button type="button" onClick={() => setEditTarget(null)} className={`w-9 h-9 flex items-center justify-center ${muted}`} aria-label="Close edit form"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid gap-3">
              {editTarget === "child" ? <>
                <ProfileImageField value={editAvatarUrl} onChange={setEditAvatarUrl} isDarkMode={isDarkMode} />
                <Field label="Name" value={editName} onChange={setEditName} isDarkMode={isDarkMode} />
                <Field label="Age" value={editAge} onChange={setEditAge} isDarkMode={isDarkMode} type="number" />
                <Field label="Gender" value={editGender} onChange={(value) => setEditGender(value as ChildProfile["gender"])} isDarkMode={isDarkMode} />
                <Field label="Growth status" value={editStatus} onChange={setEditStatus} isDarkMode={isDarkMode} />
              </> : <>
                <Field label="Parent name" value={editParentName} onChange={setEditParentName} isDarkMode={isDarkMode} />
                <Field label="Account type" value={editAccountType} onChange={setEditAccountType} isDarkMode={isDarkMode} />
              </>}
            </div>
            <button type="submit" className="w-full mt-5 bg-[#173124] text-[#faf9f5] px-4 py-3 font-['Manrope',sans-serif] text-sm font-bold hover:bg-[#2d4739] transition-colors">Save changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

const EditorialSection: React.FC<{ index: string; label: string; rule: string; muted: string; children: React.ReactNode }> = ({ index, label, rule, muted, children }) => (
  <section className={`border-t ${rule} pt-3 pb-6`}>
    <div className="flex items-baseline justify-between mb-4">
      <h2 className={`font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[1.7px] font-semibold ${muted}`}><span className="mr-4">{index}</span>{label}</h2>
      <span className={`font-['Space_Grotesk',sans-serif] text-[11px] ${muted}`}>/</span>
    </div>
    {children}
  </section>
);

const DataLine: React.FC<{ label: string; value: string; muted: string; accent?: string }> = ({ label, value, muted, accent }) => (
  <div className="flex justify-between gap-3 items-baseline"><span className={`text-[11px] uppercase tracking-[1.3px] font-semibold ${muted}`}>{label}</span><span className={`font-semibold text-right ${accent || ""}`}>{value}</span></div>
);

const EditButton: React.FC<{ onClick: () => void; label: string; ink: string; rule: string }> = ({ onClick, label, ink, rule }) => (
  <button onClick={onClick} aria-label={label} className={`w-9 h-9 border ${rule} flex items-center justify-center ${ink} transition-all hover:bg-[#cae8c9] hover:border-[#cae8c9] hover:-translate-y-0.5`}><Edit2 className="w-4 h-4" /></button>
);

const EditorialRows: React.FC<{ items: RowItem[]; rule: string; ink: string; muted: string }> = ({ items, rule, ink, muted }) => (
  <div>{items.map(({ label, icon: Icon }, index) => <button key={label} className={`group w-full flex items-center gap-4 py-4 text-left border-b ${rule} last:border-b-0 ${ink}`}><span className={`font-['Space_Grotesk',sans-serif] text-[11px] ${muted}`}>{String(index + 1).padStart(2, "0")}</span><Icon className={`w-4 h-4 ${muted}`} /><span className="flex-1 font-['Manrope',sans-serif] text-sm font-semibold">{label}</span><ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></button>)}</div>
);

const ProfileImageField: React.FC<{ value: string; onChange: (value: string) => void; isDarkMode: boolean }> = ({ value, onChange, isDarkMode }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-14 h-14 shrink-0 overflow-hidden border ${isDarkMode ? "border-[#31553d] bg-[#0d1712]" : "border-[#cae8c9] bg-[#f4f5ef]"}`}>
        {value ? <img src={value} alt="Profile preview" className="w-full h-full object-cover" /> : <ImagePlus className={`w-5 h-5 m-4 ${isDarkMode ? "text-[#3fff80]" : "text-[#6e8c75]"}`} />}
      </div>
      <label className={`flex-1 cursor-pointer border-b pb-2 font-['Manrope',sans-serif] text-sm font-semibold transition-colors ${isDarkMode ? "border-[#31553d] text-[#b0c4b5] hover:text-[#3fff80]" : "border-[#d8ddd5] text-[#424844] hover:text-[#173124]"}`}>
        <span>Profile photo</span>
        <span className={`block mt-1 text-xs font-normal ${isDarkMode ? "text-[#849b8b]" : "text-[#6e8c75]"}`}>{value ? "Choose a different image" : "Add an image from this device"}</span>
        <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
      </label>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; isDarkMode: boolean; type?: string }> = ({ label, value, onChange, isDarkMode, type = "text" }) => (
  <label className={`font-['Manrope',sans-serif] text-sm font-semibold ${isDarkMode ? "text-[#b0c4b5]" : "text-[#424844]"}`}>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={`mt-1.5 w-full border px-3.5 py-2.5 outline-none font-normal ${isDarkMode ? "bg-[#0d1712] border-[#31553d] text-white focus:border-[#3fff80]" : "bg-[#faf9f5] border-[#e3e2df] text-[#173124] focus:border-[#86bf15]"}`} /></label>
);
