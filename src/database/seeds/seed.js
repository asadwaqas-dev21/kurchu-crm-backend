/**
 * Database Seed Script
 * Creates demo data: company, admin user, lead sources, services, leads, bookings, alerts.
 *
 * Usage: npm run prisma:seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Clean Existing Data ──────────────────
  console.log('🧹 Cleaning database tables to prevent ID mismatches...');
  await prisma.notificationSetting.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.followUp.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.itinerary.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.leadSource.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});
  console.log('🧹 Database cleaned successfully.\n');

  // ─── Company ─────────────────────────────
  const company = await prisma.company.upsert({
    where: { email: 'admin@kurchucrm.com' },
    update: {},
    create: {
      name: 'Kurchu Demo Company',
      email: 'admin@kurchucrm.com',
      phone: '+92-300-1234567',
      website: 'https://kurchucrm.com',
      address: '123 Business Street',
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      zipCode: '54000',
      currency: 'PKR',
      timezone: 'Asia/Karachi',
    },
  });
  console.log(`✅ Company: ${company.name} (${company.id})`);

  // ─── Admin User ──────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123!', SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kurchucrm.com' },
    update: {},
    create: {
      email: 'admin@kurchucrm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+92-300-1234567',
      role: 'ADMIN',
      companyId: company.id,
      permissions: JSON.stringify([
        'view_leads', 'create_leads', 'edit_leads', 'delete_leads', 'assign_leads',
        'view_bookings', 'create_bookings', 'edit_bookings', 'delete_bookings',
        'view_finance', 'manage_payments', 'manage_invoices',
        'view_users', 'create_users', 'edit_users', 'delete_users',
        'edit_company', 'manage_services', 'manage_lead_sources',
        'view_dashboard', 'view_reports',
      ]),
      isActive: true,
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // ─── Sales Agent ─────────────────────────
  const agentPassword = await bcrypt.hash('Agent@123!', SALT_ROUNDS);

  const agent = await prisma.user.upsert({
    where: { email: 'agent@kurchucrm.com' },
    update: {},
    create: {
      id: 'cmqs1ywv200021455ssy0r8oz', // Aligns with hardcoded ID in Flutter dashboard
      email: 'agent@kurchucrm.com',
      password: agentPassword,
      firstName: 'Sales',
      lastName: 'Agent',
      phone: '+92-301-9876543',
      role: 'SALES_AGENT',
      companyId: company.id,
      permissions: JSON.stringify([
        'view_leads', 'create_leads', 'edit_leads',
        'view_bookings', 'create_bookings',
        'view_dashboard',
      ]),
      isActive: true,
    },
  });
  console.log(`✅ Agent: ${agent.email}`);

  // ─── Lead Sources ────────────────────────
  const leadSourceNames = ['Website', 'Phone Call', 'Referral', 'Social Media', 'Email Campaign', 'Walk-in'];

  const leadSources = [];
  for (const name of leadSourceNames) {
    const source = await prisma.leadSource.upsert({
      where: { companyId_name: { companyId: company.id, name } },
      update: {},
      create: {
        id: name === 'Website' ? 'cmqs1yxc0000614552yrasd3s' : undefined, // Aligns with hardcoded ID in Flutter dashboard
        name,
        companyId: company.id,
      },
    });
    leadSources.push(source);
  }
  console.log(`✅ Lead Sources: ${leadSources.length} created`);

  // ─── Services ────────────────────────────
  const servicesData = [
    { name: 'Web Development', description: 'Custom website development', price: 150000 },
    { name: 'Mobile App', description: 'iOS & Android app development', price: 300000 },
    { name: 'SEO Package', description: 'Search engine optimization', price: 50000 },
    { name: 'Social Media Marketing', description: 'Social media management', price: 75000 },
    { name: 'UI/UX Design', description: 'User interface and experience design', price: 100000 },
  ];

  const services = [];
  for (const s of servicesData) {
    const service = await prisma.service.create({
      data: { ...s, companyId: company.id },
    });
    services.push(service);
  }
  console.log(`✅ Services: ${services.length} created`);

  // ─── Leads ───────────────────────────────
  const leadsData = [
    { firstName: 'Ahmed', lastName: 'Khan', email: 'ahmed@example.com', phone: '+92-300-1111111', company: 'Tech Corp', stage: 'NEW' },
    { firstName: 'Sara', lastName: 'Ali', email: 'sara@example.com', phone: '+92-301-2222222', company: 'Design Studio', stage: 'CONTACTED' },
    { firstName: 'Omar', lastName: 'Malik', email: 'omar@example.com', phone: '+92-302-3333333', company: 'Marketing Pro', stage: 'INTERESTED' },
    { firstName: 'Fatima', lastName: 'Hassan', email: 'fatima@example.com', phone: '+92-303-4444444', company: 'E-Store', stage: 'DEMO' },
    { firstName: 'Bilal', lastName: 'Shah', email: 'bilal@example.com', phone: '+92-304-5555555', company: 'Startup Hub', stage: 'NEGOTIATION' },
    { firstName: 'Ayesha', lastName: 'Noor', email: 'ayesha@example.com', phone: '+92-305-6666666', company: 'HealthTech', stage: 'WON' },
    { firstName: 'Zain', lastName: 'Raza', email: 'zain@example.com', phone: '+92-306-7777777', company: 'FinServe', stage: 'NEW' },
    { firstName: 'Hira', lastName: 'Saeed', email: 'hira@example.com', phone: '+92-307-8888888', company: 'EduPlatform', stage: 'LOST' },
  ];

  const leads = [];
  for (let i = 0; i < leadsData.length; i++) {
    const lead = await prisma.lead.create({
      data: {
        ...leadsData[i],
        sourceId: leadSources[i % leadSources.length].id,
        createdById: i % 2 === 0 ? admin.id : agent.id,
        assignedToId: agent.id,
        companyId: company.id,
      },
    });
    leads.push(lead);
  }
  console.log(`✅ Leads: ${leads.length} created`);

  // ─── Follow-Ups ──────────────────────────
  const now = new Date();
  const followUpsData = [
    { leadId: leads[0].id, scheduledAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), isCompleted: false },
    { leadId: leads[1].id, scheduledAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), isCompleted: true, completedAt: new Date() },
    { leadId: leads[2].id, scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), isCompleted: false },
    { leadId: leads[3].id, scheduledAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), isCompleted: false },
  ];

  for (const f of followUpsData) {
    await prisma.followUp.create({ data: f });
  }
  console.log(`✅ Follow-Ups: ${followUpsData.length} created`);

  // ─── Bookings ────────────────────────────
  const bookingsData = [
    { leadId: leads[5].id, serviceId: services[0].id, status: 'CONFIRMED', amount: 150000, collectedAmount: 75000, pendingAmount: 75000 },
    { leadId: leads[4].id, serviceId: services[1].id, status: 'PENDING', amount: 300000, collectedAmount: 0, pendingAmount: 300000 },
    { leadId: leads[3].id, serviceId: services[2].id, status: 'IN_PROGRESS', amount: 50000, collectedAmount: 50000, pendingAmount: 0 },
  ];

  const bookings = [];
  for (const b of bookingsData) {
    const booking = await prisma.booking.create({
      data: {
        ...b,
        bookingDate: new Date(),
        companyId: company.id,
      },
    });
    bookings.push(booking);
  }
  console.log(`✅ Bookings: ${bookings.length} created`);

  // ─── Payments ────────────────────────────
  await prisma.payment.create({
    data: {
      bookingId: bookings[0].id,
      amount: 75000,
      method: 'BANK_TRANSFER',
      paidAt: new Date(),
      reference: 'TXN-001',
    },
  });
  await prisma.payment.create({
    data: {
      bookingId: bookings[2].id,
      amount: 50000,
      method: 'CASH',
      paidAt: new Date(),
      reference: 'TXN-002',
    },
  });
  console.log('✅ Payments: 2 created');

  // ─── Alerts ──────────────────────────────
  const alertsData = [
    { type: 'NEW_LEAD', title: 'New Lead Received', message: 'Ahmed Khan submitted a form on the website', severity: 'INFO' },
    { type: 'FOLLOW_UP_OVERDUE', title: 'Follow-up Overdue', message: 'Follow-up with Fatima Hassan is overdue', severity: 'WARNING' },
    { type: 'PAYMENT_DUE', title: 'Payment Due', message: 'Payment for Bilal Shah booking is pending', severity: 'WARNING' },
    { type: 'BOOKING_COMPLETED', title: 'Booking Completed', message: 'SEO Package for Omar Malik has been completed', severity: 'INFO' },
  ];

  for (const a of alertsData) {
    await prisma.alert.create({
      data: {
        ...a,
        companyId: company.id,
      },
    });
  }
  console.log(`✅ Alerts: ${alertsData.length} created`);

  console.log('\n🎉 Database seeding complete!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin:  admin@kurchucrm.com / Admin@123!');
  console.log('   Agent:  agent@kurchucrm.com / Agent@123!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
