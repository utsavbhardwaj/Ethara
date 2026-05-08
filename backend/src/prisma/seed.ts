import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const memberPassword = await bcrypt.hash('Member@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'admin@flowsphere.dev',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Chen',
      email: 'alice@flowsphere.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Martinez',
      email: 'bob@flowsphere.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: 'Carol White',
      email: 'carol@flowsphere.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  console.log('✅ Users created');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'FlowSphere Redesign',
      description: 'Complete UI/UX overhaul of the FlowSphere platform with modern design principles.',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: alice.id, role: 'MEMBER' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'API v2 Development',
      description: 'Building the next generation REST API with improved performance and new endpoints.',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: bob.id, role: 'MEMBER' },
          { userId: carol.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Mobile App Launch',
      description: 'React Native mobile application for iOS and Android platforms.',
      status: 'ON_HOLD',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdBy: admin.id,
      members: {
        create: [
          { userId: admin.id, role: 'ADMIN' },
          { userId: alice.id, role: 'MEMBER' },
          { userId: carol.id, role: 'MEMBER' },
        ],
      },
    },
  });

  console.log('✅ Projects created');

  // Create tasks for project 1
  const tasks1 = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design new color system',
        description: 'Create a cohesive color palette with dark and light mode variants.',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignedTo: alice.id,
        projectId: project1.id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement component library',
        description: 'Build reusable UI components following the new design system.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: alice.id,
        projectId: project1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'User research & interviews',
        description: 'Conduct user interviews to gather feedback on current pain points.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        assignedTo: bob.id,
        projectId: project1.id,
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        position: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Dashboard wireframes',
        description: 'Create high-fidelity wireframes for the main dashboard.',
        status: 'REVIEW',
        priority: 'HIGH',
        assignedTo: bob.id,
        projectId: project1.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Mobile responsiveness audit',
        description: 'Audit all pages for mobile responsiveness issues.',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: alice.id,
        projectId: project1.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Accessibility improvements',
        description: 'Ensure WCAG 2.1 AA compliance across all components.',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: null,
        projectId: project1.id,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        position: 1,
      },
    }),
  ]);

  // Create tasks for project 2
  await Promise.all([
    prisma.task.create({
      data: {
        title: 'API schema design',
        description: 'Design the OpenAPI schema for all new endpoints.',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignedTo: bob.id,
        projectId: project2.id,
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Authentication refactor',
        description: 'Upgrade JWT implementation with refresh tokens.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: carol.id,
        projectId: project2.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Database optimization',
        description: 'Add indexes and optimize slow queries.',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: bob.id,
        projectId: project2.id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue
        position: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write API documentation',
        description: 'Complete Swagger/OpenAPI documentation for all endpoints.',
        status: 'TODO',
        priority: 'LOW',
        assignedTo: carol.id,
        projectId: project2.id,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        position: 1,
      },
    }),
  ]);

  console.log('✅ Tasks created');

  // Create activity logs
  await Promise.all([
    prisma.activityLog.create({
      data: {
        action: 'Created project "FlowSphere Redesign"',
        entityType: 'PROJECT',
        entityId: project1.id,
        performedBy: admin.id,
        projectId: project1.id,
      },
    }),
    prisma.activityLog.create({
      data: {
        action: 'Completed task "Design new color system"',
        entityType: 'TASK',
        entityId: tasks1[0].id,
        performedBy: alice.id,
        projectId: project1.id,
      },
    }),
    prisma.activityLog.create({
      data: {
        action: 'Created project "API v2 Development"',
        entityType: 'PROJECT',
        entityId: project2.id,
        performedBy: admin.id,
        projectId: project2.id,
      },
    }),
  ]);

  console.log('✅ Activity logs created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Demo accounts:');
  console.log('  Admin:  admin@flowsphere.dev / Admin@123');
  console.log('  Alice:  alice@flowsphere.dev / Member@123');
  console.log('  Bob:    bob@flowsphere.dev / Member@123');
  console.log('  Carol:  carol@flowsphere.dev / Member@123');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
