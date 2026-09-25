import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

import mongoose from 'mongoose';
import { connectDB } from './db/mongoose';
import UserModel from './db/models/User.model';
import ProfileModel from './db/models/Profile.model';
import OpportunityModel from './db/models/Opportunity.model';
import ApplicationModel from './db/models/Application.model';
import NotificationModel from './db/models/Notification.model';
import { mockUsers, mockProfiles, mockOpportunities, mockApplications, mockNotifications } from '@/lib/mock-data';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seeding...');
  await connectDB();

  // Clear existing collections
  console.log('🧹 Clearing existing collections...');
  await UserModel.deleteMany({});
  await ProfileModel.deleteMany({});
  await OpportunityModel.deleteMany({});
  await ApplicationModel.deleteMany({});
  await NotificationModel.deleteMany({});

  // 1. Seed Users
  console.log('👤 Seeding users...');
  const userMap = new Map<string, any>(); // mockId -> userDoc
  for (const u of mockUsers) {
    const hashedPassword = await bcrypt.hash(u.password || 'password123', 10);
    const userDoc = await UserModel.create({
      name: u.name,
      email: u.email.toLowerCase(),
      password: hashedPassword,
      role: u.role,
      avatarUrl: u.avatarUrl,
    });
    userMap.set(u.id, userDoc);
    console.log(`  ✓ Created user: ${u.email} (${u.role}) -> ID: ${userDoc._id}`);
  }

  // 2. Seed Student Profiles
  console.log('📝 Seeding profiles...');
  for (const p of mockProfiles) {
    const userDoc = userMap.get(p.userId);
    if (!userDoc) continue;

    await ProfileModel.create({
      userId: userDoc._id,
      bio: p.bio,
      skills: p.skills.map((s) => ({ name: s.name })),
      projects: p.projects.map((proj) => ({
        title: proj.title,
        description: proj.description,
        imageUrl: proj.imageUrl,
        projectUrl: proj.projectUrl,
      })),
      academics: p.academics.map((acad) => ({
        degree: acad.degree,
        institution: acad.institution,
        year: acad.year,
        gpa: acad.gpa,
      })),
    });
    console.log(`  ✓ Created profile for user: ${userDoc.email}`);
  }

  // 3. Sync Live Opportunities from real-world job feeds
  console.log('💼 Syncing live opportunities from real-world job APIs...');
  const { syncLiveJobsToDatabase } = await import('./services/live-jobs.service');
  const syncResult = await syncLiveJobsToDatabase();
  console.log(`  ✓ ${syncResult.message}`);

  // 4. Seed Applications (link to first live opportunity for demo student)
  console.log('📄 Seeding initial demo applications...');
  const firstOpp = await OpportunityModel.findOne();
  const demoStudent = userMap.get('user-1');
  if (firstOpp && demoStudent) {
    await ApplicationModel.create({
      userId: demoStudent._id,
      opportunityId: firstOpp._id,
      status: 'Under Review',
    });
    console.log(`  ✓ Application: ${demoStudent.email} -> ${firstOpp.title} at ${firstOpp.company}`);
  }

  // 5. Seed Notifications
  console.log('🔔 Seeding notifications...');
  for (const n of mockNotifications) {
    const userDoc = userMap.get(n.userId);
    if (!userDoc) continue;

    await NotificationModel.create({
      userId: userDoc._id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
    });
    console.log(`  ✓ Notification for: ${userDoc.email}`);
  }

  console.log('\n🎉 Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
