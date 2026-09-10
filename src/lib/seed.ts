import { db } from "./db";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  const userCount = await db.user.count();
  if (userCount > 0) {
    return { message: "Database already seeded." };
  }

  const passwordHash = await hashPassword("password123");

  // 1. Create Users
  const owner = await db.user.create({
    data: {
      name: "Alex Morgan",
      email: "owner@flowdesk.app",
      passwordHash,
      jobTitle: "Founder & Product Lead",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      isSuperAdmin: true,
    },
  });

  const admin = await db.user.create({
    data: {
      name: "Sarah Chen",
      email: "admin@flowdesk.app",
      passwordHash,
      jobTitle: "Engineering Director",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    },
  });

  const member = await db.user.create({
    data: {
      name: "David Kim",
      email: "member@flowdesk.app",
      passwordHash,
      jobTitle: "Senior Full-Stack Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
  });

  const member2 = await db.user.create({
    data: {
      name: "Marcus Vance",
      email: "marcus@flowdesk.app",
      passwordHash,
      jobTitle: "Lead UI/UX Designer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
  });

  const viewer = await db.user.create({
    data: {
      name: "Emma Watson",
      email: "viewer@flowdesk.app",
      passwordHash,
      jobTitle: "Product Auditor",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
  });

  // 2. Create Workspace
  const workspace = await db.workspace.create({
    data: {
      name: "Banda Technologies",
      slug: "banda-tech",
      industry: "Software & SaaS",
      description: "Building next-generation collaborative design and productivity tools.",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    },
  });

  // 3. Create Memberships
  await db.workspaceMember.createMany({
    data: [
      { workspaceId: workspace.id, userId: owner.id, role: "OWNER" },
      { workspaceId: workspace.id, userId: admin.id, role: "ADMIN" },
      { workspaceId: workspace.id, userId: member.id, role: "MEMBER" },
      { workspaceId: workspace.id, userId: member2.id, role: "MEMBER" },
      { workspaceId: workspace.id, userId: viewer.id, role: "VIEWER" },
    ],
  });

  // 4. Create Subscription
  const subscription = await db.subscription.create({
    data: {
      workspaceId: workspace.id,
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await db.payment.createMany({
    data: [
      { subscriptionId: subscription.id, amount: 60, currency: "USD", status: "SUCCEEDED" },
      { subscriptionId: subscription.id, amount: 60, currency: "USD", status: "SUCCEEDED" },
    ],
  });

  // 5. Create Projects
  const p1 = await db.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Website Redesign",
      key: "WEB",
      color: "#635BFF",
      description: "Modernizing corporate site with iOS aesthetic and GSAP motion.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const p2 = await db.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Mobile Application",
      key: "MOB",
      color: "#10B981",
      description: "Native iOS & Android cross-platform client app.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const p3 = await db.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Marketing Campaign",
      key: "MKT",
      color: "#F59E0B",
      description: "Q4 product release launch strategy and press kit.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const p4 = await db.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Internal Dashboard",
      key: "INT",
      color: "#EC4899",
      description: "Real-time infrastructure performance & audit monitoring tool.",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  });

  // Assign project members
  for (const proj of [p1, p2, p3, p4]) {
    await db.projectMember.createMany({
      data: [
        { projectId: proj.id, userId: owner.id },
        { projectId: proj.id, userId: admin.id },
        { projectId: proj.id, userId: member.id },
        { projectId: proj.id, userId: member2.id },
      ],
    });
  }

  // 6. Create Tasks across Kanban stages
  const tasksData = [
    {
      title: "Create Navigation Bar with Translucent iOS Blur",
      description: "Implement sticky header navbar using backdrop-filter blur and smooth rounded surface.",
      status: "DONE",
      priority: "HIGH",
      projectId: p1.id,
      assigneeId: member2.id,
      creatorId: owner.id,
      order: 1,
    },
    {
      title: "Build Login & Auth Screens with Glassmorphism",
      description: "Design centered iOS card with tabbed authentication and password toggle.",
      status: "DONE",
      priority: "URGENT",
      projectId: p1.id,
      assigneeId: member.id,
      creatorId: admin.id,
      order: 2,
    },
    {
      title: "Dashboard UI Analytics Overview",
      description: "Assemble high-level metrics cards, Recharts velocity graph, and quick status pills.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: p1.id,
      assigneeId: member.id,
      creatorId: owner.id,
      order: 1,
    },
    {
      title: "Stripe Payment Subscription Integration",
      description: "Connect webhook handler for plan upgrades, downgrades, and billing receipts.",
      status: "IN_PROGRESS",
      priority: "URGENT",
      projectId: p4.id,
      assigneeId: admin.id,
      creatorId: owner.id,
      order: 2,
    },
    {
      title: "REST API Multi-Tenant Authorization Guard Tests",
      description: "Write integration tests ensuring cross-workspace access attempts return 403 Forbidden.",
      status: "REVIEW",
      priority: "MEDIUM",
      projectId: p4.id,
      assigneeId: member.id,
      creatorId: admin.id,
      order: 1,
    },
    {
      title: "Responsive Layout Mobile Sheet Drawer Testing",
      description: "Validate navigation sheet drawer on iOS 390px viewport.",
      status: "TODO",
      priority: "LOW",
      projectId: p2.id,
      assigneeId: member2.id,
      creatorId: owner.id,
      order: 1,
    },
    {
      title: "Homepage Apple-Style Hero Animation",
      description: "Add GSAP timeline reveal for title headline, pill badge, and preview card.",
      status: "TODO",
      priority: "MEDIUM",
      projectId: p3.id,
      assigneeId: member2.id,
      creatorId: owner.id,
      order: 2,
    },
    {
      title: "Deploy Production Infrastructure to Cloud",
      description: "Configure environment variables, database migrations, and CDN edge optimization.",
      status: "TODO",
      priority: "HIGH",
      projectId: p4.id,
      assigneeId: admin.id,
      creatorId: owner.id,
      order: 3,
    },
  ];

  for (const t of tasksData) {
    const createdTask = await db.task.create({
      data: {
        workspaceId: workspace.id,
        projectId: t.projectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        order: t.order,
        assigneeId: t.assigneeId,
        creatorId: t.creatorId,
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 10 + 2) * 24 * 60 * 60 * 1000),
      },
    });

    // Add labels
    await db.taskLabel.create({
      data: {
        taskId: createdTask.id,
        name: t.priority === "URGENT" || t.priority === "HIGH" ? "Core Release" : "Feature",
        color: t.priority === "URGENT" ? "#DC2626" : "#635BFF",
      },
    });

    // Add initial comment
    await db.taskComment.create({
      data: {
        taskId: createdTask.id,
        userId: admin.id,
        content: `Refined acceptance criteria for "${t.title}". Ready for review.`,
      },
    });
  }

  // 7. Activity Logs
  await db.activity.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: owner.id,
        projectId: p1.id,
        action: "created workspace",
        target: "Banda Technologies",
      },
      {
        workspaceId: workspace.id,
        userId: admin.id,
        projectId: p1.id,
        action: "created task",
        target: "Build Login & Auth Screens with Glassmorphism",
      },
      {
        workspaceId: workspace.id,
        userId: member.id,
        projectId: p1.id,
        action: "changed status to DONE",
        target: "Create Navigation Bar with Translucent iOS Blur",
      },
      {
        workspaceId: workspace.id,
        userId: member2.id,
        projectId: p3.id,
        action: "added comment",
        target: "Homepage Apple-Style Hero Animation",
      },
    ],
  });

  // 8. Notifications
  await db.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: owner.id,
        title: "Task Assigned",
        message: "Sarah Chen assigned you to Dashboard UI Analytics Overview",
        type: "TASK_ASSIGNED",
        link: "/projects",
        read: false,
      },
      {
        workspaceId: workspace.id,
        userId: owner.id,
        title: "New Comment",
        message: "David Kim commented on REST API Multi-Tenant Authorization Guard Tests",
        type: "COMMENT_ADDED",
        link: "/tasks",
        read: true,
      },
      {
        workspaceId: workspace.id,
        userId: admin.id,
        title: "Project Milestone Reached",
        message: "Website Redesign is now 75% completed",
        type: "PROJECT_UPDATED",
        link: "/projects",
        read: false,
      },
    ],
  });

  // 9. Audit Logs
  await db.auditLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: owner.id,
        action: "WORKSPACE_CREATE",
        resource: `Workspace:${workspace.id}`,
        ipAddress: "127.0.0.1",
        metadata: JSON.stringify({ name: "Banda Technologies" }),
      },
      {
        workspaceId: workspace.id,
        userId: admin.id,
        action: "USER_INVITE",
        resource: "User:david@flowdesk.app",
        ipAddress: "127.0.0.1",
        metadata: JSON.stringify({ role: "MEMBER" }),
      },
    ],
  });

  return { message: "Database seeded successfully!", workspaceId: workspace.id };
}
