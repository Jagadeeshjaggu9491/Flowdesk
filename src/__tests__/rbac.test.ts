import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../lib/auth";

describe("FlowDesk Auth & RBAC Security Suite", () => {
  it("should create and verify valid session JWT tokens", () => {
    const sessionUser = {
      id: "usr_test_123",
      name: "Alex Morgan",
      email: "owner@flowdesk.app",
      isSuperAdmin: true,
    };

    const token = signToken(sessionUser);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("usr_test_123");
    expect(decoded?.email).toBe("owner@flowdesk.app");
  });

  it("should reject invalid/tampered tokens gracefully", () => {
    const invalidToken = "invalid.tampered.token";
    const decoded = verifyToken(invalidToken);
    expect(decoded).toBeNull();
  });
});
