export interface PasswordStrength {
  score: number;        // 0‑4
  label: string;
  color: string;
  width: string;
  requirements: { text: string; met: boolean }[];
}

export function checkPasswordStrength(pw: string): PasswordStrength {
  const requirements = [
    { text: "At least 8 characters", met: pw.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(pw) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(pw) },
    { text: "Contains a digit", met: /\d/.test(pw) },
    { text: "Contains special character", met: /[^A-Za-z0-9]/.test(pw) },
  ];
  const met = requirements.filter(r => r.met).length;

  const levels: Record<number, { label: string; color: string; width: string }> = {
    0: { label: "Too weak", color: "bg-rose-500", width: "w-[5%]" },
    1: { label: "Weak", color: "bg-rose-500", width: "w-1/4" },
    2: { label: "Fair", color: "bg-amber-500", width: "w-2/4" },
    3: { label: "Good", color: "bg-emerald-500", width: "w-3/4" },
    4: { label: "Strong", color: "bg-emerald-400", width: "w-full" },
    5: { label: "Excellent", color: "bg-cyan-400", width: "w-full" },
  };
  const level = levels[Math.min(met, 5)];
  return { score: met, label: level.label, color: level.color, width: level.width, requirements };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?\d{7,15}$/.test(phone.replace(/[\s()-]/g, ""));
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
