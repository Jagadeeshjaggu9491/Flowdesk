import { db } from "./db";

export type Role = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export async function verifyWorkspaceMember(workspaceId: string, userId: string) {
  const membership = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("Access denied: You are not a member of this workspace");
  }

  return membership;
}

export async function requireWorkspaceRole(workspaceId: string, userId: string, requiredRole: Role) {
  const membership = await verifyWorkspaceMember(workspaceId, userId);
  const userLevel = ROLE_HIERARCHY[membership.role as Role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    throw new Error(`Insufficient permissions: ${requiredRole} role required`);
  }

  return membership;
}

export async function verifyProjectAccess(projectId: string, workspaceId: string) {
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
  });

  if (!project) {
    throw new Error("Project not found in this workspace");
  }

  return project;
}
