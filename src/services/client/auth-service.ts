import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  ApiResponse,
} from "@/types";
import { MOCK_USERS } from "@/mock/data";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === credentials.email);
    if (!user || user.status === "suspended" || user.status === "banned") {
      return {
        success: false,
        data: null as unknown as AuthUser,
        message: "Invalid credentials or account suspended",
      };
    }
    const authUser: AuthUser = {
      ...user,
      token: `mock_token_${user.id}_${Date.now()}`,
    };
    localStorage.setItem("auth_token", authUser.token!);
    localStorage.setItem("current_user", JSON.stringify(authUser));
    return { success: true, data: authUser, message: "Login successful" };
  },

  async register(data: RegisterData): Promise<ApiResponse<AuthUser>> {
    await delay(600);
    if (MOCK_USERS.some((u) => u.email === data.email)) {
      return {
        success: false,
        data: null as unknown as AuthUser,
        message: "Email already registered",
      };
    }
    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "user",
      status: "unverified",
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token: `mock_token_${Date.now()}`,
    };
    MOCK_USERS.push(newUser);
    localStorage.setItem("auth_token", newUser.token!);
    localStorage.setItem("current_user", JSON.stringify(newUser));
    return {
      success: true,
      data: newUser,
      message: "Registration successful! Please verify your email.",
    };
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
  },

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem("current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },
};
