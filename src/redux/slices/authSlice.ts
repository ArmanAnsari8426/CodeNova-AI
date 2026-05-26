import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "@/services/authAPI";

/* ══════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════ */
export type UserRole = "student" | "teacher" | "admin";
export type AuthProvider = "local" | "google" | "github";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  role: UserRole;
  provider: AuthProvider;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  otpSent: boolean;
  otpEmail: string | null;
  devOtp: string | null;
  passwordResetToken: string | null;
  rememberMe: boolean;
}

/* ══════════════════════════════════════════════════════════════
   Demo User Fallback
   ══════════════════════════════════════════════════════════════ */
const DEMO_USER: User = {
  _id: "u_001",
  fullName: "Aarav Kumar",
  username: "arav.dev",
  email: "demo@codenova.ai",
  avatar: "",
  phone: "+91 98765 43210",
  role: "student",
  provider: "local",
  isVerified: true,
  createdAt: new Date().toISOString(),
};

const DEMO_CREDENTIALS = {
  email: "demo@codenova.ai",
  username: "arav.dev",
  password: "Demo@1234",
};

function makeToken(u: User) {
  try {
    return `supabase_mock.${btoa(JSON.stringify({ id: u._id, role: u.role }))}.session`;
  } catch {
    return "demo_token_mock";
  }
}

/* ══════════════════════════════════════════════════════════════
   Safe Storage Helpers
   ══════════════════════════════════════════════════════════════ */
function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}
function safeRemove(key: string) {
  try { localStorage.removeItem(key); } catch {}
}
function safeSessionGet(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function safeSessionSet(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch {}
}
function safeSessionRemove(key: string) {
  try { sessionStorage.removeItem(key); } catch {}
}

/* ══════════════════════════════════════════════════════════════
   Mapping helpers
   ══════════════════════════════════════════════════════════════ */
function profileToUser(authUser: any, profile: any): User {
  return {
    _id: authUser?.id || profile?.id || DEMO_USER._id,
    fullName:
      profile?.full_name ||
      authUser?.user_metadata?.full_name ||
      authUser?.user_metadata?.name ||
      DEMO_USER.fullName,
    username:
      profile?.username ||
      authUser?.user_metadata?.username ||
      authUser?.email?.split("@")[0] ||
      DEMO_USER.username,
    email: authUser?.email || profile?.email || DEMO_USER.email,
    avatar:
      profile?.avatar_url ||
      authUser?.user_metadata?.avatar_url ||
      authUser?.user_metadata?.picture ||
      "",
    phone: profile?.phone || authUser?.user_metadata?.phone || "",
    role: profile?.role || authUser?.user_metadata?.role || "student",
    provider: profile?.provider || authUser?.app_metadata?.provider || authUser?.user_metadata?.provider || "local",
    isVerified: !!(profile?.is_verified ?? authUser?.email_confirmed_at ?? true),
    createdAt: profile?.created_at || authUser?.created_at || new Date().toISOString(),
  };
}

function getErrMsg(err: any, fallback: string): string {
  if (err?.message) return err.message;
  if (err?.error_description) return err.error_description;
  return fallback;
}

function persistAuth(remember: boolean, user: User | null, token: string | null) {
  if (!user || !token) return;
  if (remember) {
    safeSet("cn_remember", "true");
    safeSet("cn_user", JSON.stringify(user));
    safeSet("cn_token", token);
    safeSessionRemove("cn_user");
    safeSessionRemove("cn_token");
  } else {
    safeRemove("cn_remember");
    safeSessionSet("cn_user", JSON.stringify(user));
    safeSessionSet("cn_token", token);
    safeRemove("cn_user");
    safeRemove("cn_token");
  }
}

function clearPersist() {
  safeRemove("cn_user");
  safeRemove("cn_token");
  safeRemove("cn_remember");
  safeSessionRemove("cn_user");
  safeSessionRemove("cn_token");
}

/* ══════════════════════════════════════════════════════════════
   Initial state
   ══════════════════════════════════════════════════════════════ */
const savedUserRaw = safeGet("cn_user") || safeSessionGet("cn_user");
const savedToken = safeGet("cn_token") || safeSessionGet("cn_token");
let savedUser: User | null = null;
try { savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null; } catch { savedUser = null; }

const initialState: AuthState = {
  user: savedUser || DEMO_USER,
  accessToken: savedToken || makeToken(savedUser || DEMO_USER),
  isAuthenticated: !!(savedUser || savedToken),
  loading: false,
  error: null,
  success: null,
  otpSent: false,
  otpEmail: null,
  devOtp: null,
  passwordResetToken: null,
  rememberMe: safeGet("cn_remember") === "true",
};

/* ══════════════════════════════════════════════════════════════
   Thunks
   ══════════════════════════════════════════════════════════════ */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (
    payload: {
      fullName: string;
      username: string;
      email: string;
      password: string;
      phone: string;
      role: UserRole;
      remember: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const result: any = await authAPI.signup({
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        role: payload.role,
      });

      const user = profileToUser(result?.user, {
        full_name: payload.fullName,
        username: payload.username,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        provider: "local",
        is_verified: !!result?.user?.email_confirmed_at,
      });

      const token = result?.session?.access_token || makeToken(user);
      return { user, token, remember: payload.remember, devOtp: result?.devOtp || null };
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(900);
        const user: User = {
          _id: `u_${Math.random().toString(36).slice(2, 10)}`,
          fullName: payload.fullName,
          username: payload.username,
          email: payload.email,
          avatar: "",
          phone: payload.phone,
          role: payload.role,
          provider: "local",
          isVerified: false,
          createdAt: new Date().toISOString(),
        };
        return { user, token: makeToken(user), remember: payload.remember, devOtp: null };
      }
      return rejectWithValue(getErrMsg(err, "Registration failed."));
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: { identifier: string; password: string; remember: boolean },
    { rejectWithValue }
  ) => {
    try {
      const result: any = await authAPI.login({
        identifier: payload.identifier,
        password: payload.password,
      });

      const user = profileToUser(result?.user, result?.profile);
      const token = result?.session?.access_token || makeToken(user);
      return { user, token, remember: payload.remember };
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(700);
        const id = payload.identifier.trim().toLowerCase();
        if (id === DEMO_CREDENTIALS.email || id === DEMO_CREDENTIALS.username) {
          if (payload.password === DEMO_CREDENTIALS.password) {
            return { user: DEMO_USER, token: makeToken(DEMO_USER), remember: payload.remember };
          }
          return rejectWithValue("Incorrect password. Please try again.");
        }
        return rejectWithValue("No account found with that email or username.");
      }
      return rejectWithValue(getErrMsg(err, "Login failed."));
    }
  }
);

export const socialLoginThunk = createAsyncThunk(
  "auth/socialLogin",
  async (
    payload: {
      provider: "google" | "github";
      remember: boolean;
      email?: string;
      name?: string;
      picture?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (payload.provider === "google") {
        await authAPI.googleLogin();
      } else {
        await authAPI.githubLogin();
      }

      const session: any = await authAPI.session();
      const me: any = await authAPI.me();
      const user = profileToUser(me?.user, me?.profile);
      const token = session?.access_token || makeToken(user);
      return { user, token, remember: payload.remember };
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(900);
        const user: User = {
          _id: `u_${Math.random().toString(36).slice(2, 10)}`,
          fullName: payload.name || (payload.provider === "google" ? "Priya Sharma" : "Dev Hero"),
          username: (payload.email ? payload.email.split("@")[0] : payload.provider === "google" ? "priya" : "devhero").replace(/[^a-zA-Z0-9_]/g, ""),
          email: payload.email || (payload.provider === "google" ? "priya@gmail.com" : "devhero@github.com"),
          avatar: payload.picture || "",
          phone: "",
          role: "student",
          provider: payload.provider,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        return { user, token: makeToken(user), remember: payload.remember };
      }
      return rejectWithValue(getErrMsg(err, `${payload.provider} login failed.`));
    }
  }
);

export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (
    payload: { email: string; purpose?: string },
    { rejectWithValue }
  ) => {
    try {
      const result: any = await authAPI.sendOtp(payload.email, payload.purpose);
      return { email: payload.email, devOtp: result?.devOtp || null };
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(700);
        return { email: payload.email, devOtp: null };
      }
      return rejectWithValue(getErrMsg(err, "Failed to send OTP."));
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (
    payload: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      await authAPI.verifyOtp(payload.email, payload.otp);
      return { verified: true };
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(600);
        if (payload.otp.length === 6) return { verified: true };
      }
      return rejectWithValue(getErrMsg(err, "Invalid OTP. Please try again."));
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (
    payload: { email: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      await authAPI.resetPassword(payload.email, payload.newPassword);
      return true;
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        await delay(700);
        return true;
      }
      return rejectWithValue(getErrMsg(err, "Password reset failed."));
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await authAPI.logout();
  } catch {
    // Ignore API errors, still clear local state
  }
  clearPersist();
  return true;
});

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: Partial<User>,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const current = state.auth.user;
      if (!current) throw new Error("No user session found.");

      const profile = await authAPI.updateProfile({
        id: current._id,
        email: current.email,
        full_name: payload.fullName || current.fullName,
        username: payload.username || current.username,
        phone: payload.phone || current.phone,
        avatar_url: payload.avatar || current.avatar,
        role: payload.role || current.role,
        provider: payload.provider || current.provider,
        is_verified: payload.isVerified ?? current.isVerified,
      });

      return profileToUser({ id: current._id, email: current.email }, profile);
    } catch (err: any) {
      if (!navigator.onLine || err?.code === "ERR_NETWORK") {
        return payload as User;
      }
      return rejectWithValue(getErrMsg(err, "Profile update failed."));
    }
  }
);

/* ══════════════════════════════════════════════════════════════
   Slice
   ══════════════════════════════════════════════════════════════ */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    clearSuccess(state) { state.success = null; },
    clearOtpState(state) { state.otpSent = false; state.otpEmail = null; state.devOtp = null; },
    setRememberMe(state, action: PayloadAction<boolean>) { state.rememberMe = action.payload; },
    updateProfileLocal(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const serialized = JSON.stringify(state.user);
        if (state.rememberMe) safeSet("cn_user", serialized);
        else safeSessionSet("cn_user", serialized);
      }
    },
    setAuthFromSession(state, action: PayloadAction<{ user: User; token: string | null }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    const pending = (s: AuthState) => {
      s.loading = true;
      s.error = null;
      s.success = null;
    };

    builder
      .addCase(signupThunk.pending, pending)
      .addCase(signupThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.token;
        s.isAuthenticated = false;
        s.otpSent = true;
        s.otpEmail = a.payload.user.email;
        s.devOtp = a.payload.devOtp;
        s.success = "Account created! Please verify your email with the OTP we sent.";
        persistAuth(a.payload.remember, a.payload.user, a.payload.token);
      })
      .addCase(signupThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.token;
        s.isAuthenticated = true;
        s.success = `Welcome back, ${a.payload.user.fullName.split(" ")[0]}!`;
        persistAuth(a.payload.remember, a.payload.user, a.payload.token);
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(socialLoginThunk.pending, pending)
      .addCase(socialLoginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.token;
        s.isAuthenticated = true;
        s.success = `Signed in with ${a.payload.user.provider === "google" ? "Google" : "GitHub"}!`;
        persistAuth(a.payload.remember, a.payload.user, a.payload.token);
      })
      .addCase(socialLoginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(sendOtpThunk.pending, pending)
      .addCase(sendOtpThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.otpSent = true;
        s.otpEmail = a.payload.email;
        s.devOtp = a.payload.devOtp;
        s.success = `OTP sent to ${a.payload.email}. Check your inbox!`;
      })
      .addCase(sendOtpThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(verifyOtpThunk.pending, pending)
      .addCase(verifyOtpThunk.fulfilled, (s) => {
        s.loading = false;
        if (s.user) s.user.isVerified = true;
        s.isAuthenticated = true;
        s.devOtp = null;
        s.success = "Email verified successfully!";
      })
      .addCase(verifyOtpThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(resetPasswordThunk.pending, pending)
      .addCase(resetPasswordThunk.fulfilled, (s) => {
        s.loading = false;
        s.success = "Password reset successfully! You can now sign in with your new password.";
        s.otpSent = false;
        s.otpEmail = null;
        s.devOtp = null;
      })
      .addCase(resetPasswordThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })

      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = DEMO_USER;
        s.accessToken = makeToken(DEMO_USER);
        s.isAuthenticated = false;
        s.error = null;
        s.success = null;
        s.otpSent = false;
        s.otpEmail = null;
        s.devOtp = null;
      })

      .addCase(updateProfileThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        s.success = "Profile updated successfully!";
        const serialized = JSON.stringify(a.payload);
        if (s.rememberMe) safeSet("cn_user", serialized);
        else safeSessionSet("cn_user", serialized);
      })
      .addCase(updateProfileThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearOtpState,
  setRememberMe,
  updateProfileLocal,
  setAuthFromSession,
} = authSlice.actions;

export default authSlice.reducer;
