import bcrypt from 'bcryptjs';
import {
  BugStatus,
  IssueType,
  Priority,
  ProjectRole,
  Severity,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_ROLES = [
  { name: 'Admin', description: 'Full system access' },
  { name: 'Project Manager', description: 'Manage projects, releases, and assignments' },
  { name: 'Developer', description: 'Work on assigned bugs and comment' },
  { name: 'QA', description: 'Create and verify bugs; view reports' },
  { name: 'Viewer', description: 'Read-only access' },
];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bugHistory.deleteMany();
  await prisma.bug.deleteMany();
  await prisma.release.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const roles = [];
  for (const r of SYSTEM_ROLES) {
    roles.push(await prisma.role.create({ data: r }));
  }
  const byName = Object.fromEntries(roles.map((r) => [r.name, r]));

  const passwordHash = await bcrypt.hash('Password123!', 10);

  async function createUser(
    email: string,
    name: string,
    roleNames: string[]
  ) {
    return prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        roles: {
          create: roleNames.map((n) => ({ roleId: byName[n].id })),
        },
      },
    });
  }

  const admin = await createUser('admin@qa.local', 'System Admin', ['Admin']);
  const pm = await createUser('pm@qa.local', 'Project Manager', ['Project Manager']);
  const qa = await createUser('qa@qa.local', 'QA Engineer', ['QA']);
  const dev = await createUser('dev@qa.local', 'Developer', ['Developer']);

  const project = await prisma.project.create({
    data: {
      name: 'Demo Product',
      key: 'DEMO',
      description: 'Sample project for QA Bug Tracker',
      bugSeq: 2,
      members: {
        create: [
          { userId: admin.id, projectRole: ProjectRole.OWNER },
          { userId: pm.id, projectRole: ProjectRole.LEAD },
          { userId: qa.id, projectRole: ProjectRole.QA },
          { userId: dev.id, projectRole: ProjectRole.DEVELOPER },
        ],
      },
    },
  });

  const feature = await prisma.feature.create({
    data: {
      projectId: project.id,
      name: 'Authentication',
      description: 'Login and session flows',
    },
  });

  const release = await prisma.release.create({
    data: {
      projectId: project.id,
      name: 'Sprint 1',
      version: '1.0.0',
      notes: 'Initial release candidate',
    },
  });

  const bug1 = await prisma.bug.create({
    data: {
      bugKey: 'BUG-DEMO-1',
      projectId: project.id,
      featureId: feature.id,
      title: 'Login button unresponsive on mobile',
      description: 'Tap does nothing on iOS Safari',
      issueType: IssueType.FRONTEND,
      severity: Severity.HIGH,
      priority: Priority.P1,
      status: BugStatus.OPEN,
      expectedResult: 'User is logged in',
      actualResult: 'Nothing happens',
      reproductionSteps: '1. Open login\n2. Enter credentials\n3. Tap Login',
      environment: 'iOS 17 / Safari',
      buildVersion: '1.0.0-rc1',
      reporterId: qa.id,
      assigneeId: dev.id,
      releaseId: release.id,
    },
  });

  await prisma.bug.create({
    data: {
      bugKey: 'BUG-DEMO-2',
      projectId: project.id,
      featureId: feature.id,
      title: 'API returns 500 on empty filter',
      description: 'GET /bugs with empty severity crashes',
      issueType: IssueType.API,
      severity: Severity.CRITICAL,
      priority: Priority.P0,
      status: BugStatus.IN_PROGRESS,
      expectedResult: 'Empty filter ignored',
      actualResult: '500 Internal Server Error',
      reproductionSteps: 'Call GET /bugs?severity=',
      environment: 'Staging',
      buildVersion: '1.0.0-rc1',
      reporterId: qa.id,
      assigneeId: dev.id,
    },
  });

  await prisma.bugHistory.create({
    data: {
      bugId: bug1.id,
      actorId: qa.id,
      field: 'created',
      newValue: bug1.bugKey,
    },
  });

  await prisma.comment.create({
    data: {
      bugId: bug1.id,
      authorId: qa.id,
      body: 'Reproduced on iPhone 14. Blocking release.',
    },
  });

  await prisma.notification.create({
    data: {
      userId: dev.id,
      title: 'Bug assigned',
      message: `You were assigned ${bug1.bugKey}`,
      link: `/bugs/${bug1.id}`,
    },
  });

  console.log('Seed complete');
  console.log('Admin: admin@qa.local / Password123!');
  console.log('PM:    pm@qa.local / Password123!');
  console.log('QA:    qa@qa.local / Password123!');
  console.log('Dev:   dev@qa.local / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
