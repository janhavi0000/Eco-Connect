const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

const User = require('../models/User');
const Recycler = require('../models/Recycler');
const EWasteRequest = require('../models/EWasteRequest');
const PickupSpot = require('../models/PickupSpot');
const CollectionRecord = require('../models/CollectionRecord');
const SurveyResponse = require('../models/SurveyResponse');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing demo collections...');
    await User.deleteMany({});
    await Recycler.deleteMany({});
    await EWasteRequest.deleteMany({});
    await PickupSpot.deleteMany({});
    await CollectionRecord.deleteMany({});
    await SurveyResponse.deleteMany({});

    console.log('[Seed] Creating core accounts...');

    // 1. Admin Account
    const admin = await User.create({
      name: 'EcoConnect Administrator',
      email: 'admin@ecoconnect.org',
      phone: '+1-555-0100',
      password: 'AdminPassword123!',
      role: 'admin'
    });

    // 2. Verified Recycler Account
    const verifiedRecyclerUser = await User.create({
      name: 'Sarah Jenkins (GreenCycle)',
      email: 'recycler@greencycle.org',
      phone: '+1-555-0200',
      password: 'RecyclerPassword123!',
      role: 'recycler'
    });

    const verifiedRecycler = await Recycler.create({
      userId: verifiedRecyclerUser._id,
      organizationName: 'GreenCycle E-Waste Facility',
      contactPerson: 'Sarah Jenkins',
      phone: '+1-555-0200',
      email: 'recycler@greencycle.org',
      address: '104 Eco Tech Park, Sector 4, Innovation District',
      latitude: 28.6139,
      longitude: 77.2090,
      serviceAreas: ['Campus North', 'Downtown Hub', 'Greenfield Suburb'],
      supportedCategories: [
        'Mobile Phones',
        'Chargers / Cables',
        'Batteries',
        'Laptops / Computers',
        'Keyboards',
        'Earphones / Headphones',
        'Tablets',
        'Monitors',
        'Other Electronic Devices'
      ],
      description: 'Certified college partner facility specializing in zero-landfill electronic components processing and hazardous battery recycling.',
      availability: {
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        timeSlots: [
          '09:00 - 11:00 AM',
          '11:00 - 01:00 PM',
          '02:00 - 04:00 PM',
          '04:00 - 06:00 PM'
        ]
      },
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date()
    });

    // 3. Pending Recycler Account (to test Admin verification flow)
    const pendingRecyclerUser = await User.create({
      name: 'David Patel (Metro Scrap)',
      email: 'contact@metroescrap.com',
      phone: '+1-555-0300',
      password: 'RecyclerPassword123!',
      role: 'recycler'
    });

    await Recycler.create({
      userId: pendingRecyclerUser._id,
      organizationName: 'Metro E-Scrap Hub',
      contactPerson: 'David Patel',
      phone: '+1-555-0300',
      email: 'contact@metroescrap.com',
      address: '42 Industrial Boulevard, Outer Ring Road',
      latitude: 28.6289,
      longitude: 77.2180,
      serviceAreas: ['Outer Ring Road', 'Metro South'],
      supportedCategories: ['Mobile Phones', 'Batteries', 'Keyboards'],
      description: 'Regional e-scrap collector seeking community verification for sustainable component dismantling.',
      verificationStatus: 'PENDING'
    });

    // 4. Community User Account
    const communityUser = await User.create({
      name: 'Alex Rivera',
      email: 'user@ecoconnect.org',
      phone: '+1-555-0400',
      password: 'UserPassword123!',
      role: 'user'
    });

    console.log('[Seed] Creating pickup spots...');
    // 5. Pickup Spots for GreenCycle
    const spot1 = await PickupSpot.create({
      recyclerId: verifiedRecycler._id,
      name: 'Campus Central Student Union Kiosk',
      address: 'Building A, Student Center Plaza, University Campus',
      latitude: 28.6150,
      longitude: 77.2100,
      availableDates: ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-20'],
      availableTimeSlots: [
        '09:00 - 11:00 AM',
        '11:00 - 01:00 PM',
        '02:00 - 04:00 PM',
        '04:00 - 06:00 PM'
      ],
      slotCapacity: 5,
      instructions: 'Look for the branded green EcoConnect CEP collection container near the lobby entrance.'
    });

    const spot2 = await PickupSpot.create({
      recyclerId: verifiedRecycler._id,
      name: 'Greenfield Community Center Drop-off',
      address: '77 Elm Street, Community Hall Parking Zone',
      latitude: 28.6210,
      longitude: 77.2140,
      availableDates: ['2026-10-15', '2026-10-18', '2026-10-22'],
      availableTimeSlots: [
        '10:00 - 12:00 PM',
        '02:00 - 04:00 PM'
      ],
      slotCapacity: 4,
      instructions: 'Staffed drop-off tent operating during designated community collection hours.'
    });

    console.log('[Seed] Creating demo e-waste requests...');

    // Request 1: PENDING
    await EWasteRequest.create({
      userId: communityUser._id,
      recyclerId: verifiedRecycler._id,
      items: [
        {
          category: 'Mobile Phones',
          itemType: 'Old Smartphone (Samsung Galaxy S9)',
          quantity: 2,
          weight: 0.4,
          condition: 'Partially Working',
          description: 'Cracked glass screen, powers on but sluggish.'
        },
        {
          category: 'Chargers / Cables',
          itemType: 'Assorted Micro-USB & Lightning Cables',
          quantity: 4,
          weight: 0.3,
          condition: 'Scrap / Unusable',
          description: 'Frayed charging cables.'
        }
      ],
      totalQuantity: 6,
      estimatedWeight: 0.7,
      preferredDisposalMethod: 'Eco Recycling',
      pickupMethod: 'Doorstep Pickup',
      pickupLocation: {
        address: 'Apartment 4B, Pinecrest Residences, Campus North',
        latitude: 28.6142,
        longitude: 77.2095
      },
      preferredDate: '2026-10-16',
      preferredTime: '11:00 - 01:00 PM',
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(Date.now() - 3600000 * 4),
          note: 'Request registered by community member Alex Rivera.',
          changedBy: communityUser._id
        }
      ],
      collectorNotes: 'Please ring bell upon arrival.'
    });

    // Request 2: SCHEDULED
    await EWasteRequest.create({
      userId: communityUser._id,
      recyclerId: verifiedRecycler._id,
      items: [
        {
          category: 'Laptops / Computers',
          itemType: 'Obsolete Dell Inspiron 15 Notebook',
          quantity: 1,
          weight: 2.2,
          condition: 'Dead / Damaged',
          description: 'Dead motherboard, hard drive removed for data privacy.'
        }
      ],
      totalQuantity: 1,
      estimatedWeight: 2.2,
      preferredDisposalMethod: 'Eco Recycling',
      pickupMethod: 'Nearby Pickup Point',
      pickupLocation: {
        address: spot1.address,
        latitude: spot1.latitude,
        longitude: spot1.longitude
      },
      selectedPickupSpot: {
        name: spot1.name,
        address: spot1.address,
        latitude: spot1.latitude,
        longitude: spot1.longitude
      },
      preferredDate: '2026-10-17',
      preferredTime: '02:00 - 04:00 PM',
      status: 'SCHEDULED',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(Date.now() - 3600000 * 24),
          note: 'Request registered by community member Alex Rivera.',
          changedBy: communityUser._id
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(Date.now() - 3600000 * 18),
          note: 'Request accepted by GreenCycle E-Waste Facility.',
          changedBy: verifiedRecyclerUser._id
        },
        {
          status: 'SCHEDULED',
          timestamp: new Date(Date.now() - 3600000 * 12),
          note: 'Pickup scheduled for Campus Kiosk on 2026-10-17 between 02:00 - 04:00 PM.',
          changedBy: verifiedRecyclerUser._id
        }
      ]
    });

    // Request 3: COLLECTED with CollectionRecord archive
    const collectedReq = await EWasteRequest.create({
      userId: communityUser._id,
      recyclerId: verifiedRecycler._id,
      items: [
        {
          category: 'Batteries',
          itemType: 'Lithium-ion power banks & laptop batteries',
          quantity: 5,
          weight: 1.5,
          condition: 'Dead / Damaged',
          description: 'Depleted lithium cells requiring safe chemical recovery.'
        },
        {
          category: 'Earphones / Headphones',
          itemType: 'Broken wired earphones',
          quantity: 3,
          weight: 0.2,
          condition: 'Dead / Damaged',
          description: 'Torn wires.'
        }
      ],
      totalQuantity: 8,
      estimatedWeight: 1.7,
      preferredDisposalMethod: 'Eco Recycling',
      pickupMethod: 'Doorstep Pickup',
      pickupLocation: {
        address: 'Apartment 4B, Pinecrest Residences, Campus North',
        latitude: 28.6142,
        longitude: 77.2095
      },
      preferredDate: '2026-10-12',
      preferredTime: '09:00 - 11:00 AM',
      status: 'COLLECTED',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(Date.now() - 3600000 * 48),
          note: 'Request registered.',
          changedBy: communityUser._id
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(Date.now() - 3600000 * 36),
          note: 'Accepted by GreenCycle.',
          changedBy: verifiedRecyclerUser._id
        },
        {
          status: 'SCHEDULED',
          timestamp: new Date(Date.now() - 3600000 * 24),
          note: 'Scheduled for morning pickup.',
          changedBy: verifiedRecyclerUser._id
        },
        {
          status: 'COLLECTED',
          timestamp: new Date(Date.now() - 3600000 * 2),
          note: 'Collected by GreenCycle collection team.',
          changedBy: verifiedRecyclerUser._id
        }
      ],
      collectedAt: new Date(Date.now() - 3600000 * 2)
    });

    // Corresponding permanent CollectionRecord
    await CollectionRecord.create({
      requestId: collectedReq._id,
      userId: communityUser._id,
      recyclerId: verifiedRecycler._id,
      userName: communityUser.name,
      recyclerName: verifiedRecycler.organizationName,
      items: collectedReq.items,
      primaryCategory: 'Batteries',
      totalQuantity: collectedReq.totalQuantity,
      totalWeight: collectedReq.estimatedWeight,
      pickupLocation: collectedReq.pickupLocation,
      collectionDate: collectedReq.collectedAt,
      status: 'COLLECTED',
      requestCreatedAt: collectedReq.createdAt,
      completedAt: collectedReq.collectedAt
    });

    console.log('[Seed] Creating demo community survey responses...');
    const demoSurveys = [
      {
        respondentName: 'Jordan Taylor',
        q1_awareness: 'Yes',
        q2_hasUnusedItems: 'Yes',
        q3_itemTypes: ['Mobile phones', 'Chargers/cables', 'Batteries'],
        q4_currentPractice: 'Keep them at home',
        q5_knowsRecycler: 'No',
        q6_mainDifficulty: 'No nearby collection point',
        q7_preferredMethod: 'Doorstep pickup',
        q8_wouldUsePlatform: 'Yes',
        q9_usefulFeatures: ['Find nearby recyclers/collection points', 'Select pickup date and time', 'Track collection request'],
        q10_willingToParticipate: 'Yes',
        comments: 'Great initiative for university residential zones!'
      },
      {
        respondentName: 'Maya Chen',
        q1_awareness: 'Somewhat',
        q2_hasUnusedItems: 'Yes',
        q3_itemTypes: ['Laptops/computers', 'Earphones/headphones'],
        q4_currentPractice: 'Give them to a scrap dealer',
        q5_knowsRecycler: 'No',
        q6_mainDifficulty: "Don't know where to dispose of it",
        q7_preferredMethod: 'Nearby pickup point',
        q8_wouldUsePlatform: 'Yes',
        q9_usefulFeatures: ['Find nearby recyclers/collection points', 'View recycler/collector information'],
        q10_willingToParticipate: 'Yes',
        comments: 'Clear guidelines on data security would be wonderful.'
      },
      {
        respondentName: 'Liam Johnson',
        q1_awareness: 'No',
        q2_hasUnusedItems: 'Yes',
        q3_itemTypes: ['Chargers/cables', 'Other electronic devices'],
        q4_currentPractice: 'Throw them with regular waste',
        q5_knowsRecycler: 'No',
        q6_mainDifficulty: "Don't know any recycler",
        q7_preferredMethod: 'Community collection drive',
        q8_wouldUsePlatform: 'Maybe',
        q9_usefulFeatures: ['Select pickup date and time', 'Submit e-waste details'],
        q10_willingToParticipate: 'Maybe',
        comments: 'Awareness workshops are very needed.'
      },
      {
        respondentName: 'Priya Sharma',
        q1_awareness: 'Yes',
        q2_hasUnusedItems: 'No',
        q3_itemTypes: ['Mobile phones', 'Batteries'],
        q4_currentPractice: 'Give them to an e-waste recycler',
        q5_knowsRecycler: 'Yes',
        q6_mainDifficulty: 'Inconvenient collection timings',
        q7_preferredMethod: 'Doorstep pickup',
        q8_wouldUsePlatform: 'Yes',
        q9_usefulFeatures: ['Select pickup date and time', 'Track collection request'],
        q10_willingToParticipate: 'Yes',
        comments: 'Slot booking is the key feature.'
      }
    ];

    await SurveyResponse.insertMany(demoSurveys);

    console.log('----------------------------------------------------');
    console.log('EcoConnect Demo Database Seed Completed Successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:');
    console.log('  Email:    admin@ecoconnect.org');
    console.log('  Password: AdminPassword123!');
    console.log('Verified Recycler Account:');
    console.log('  Email:    recycler@greencycle.org');
    console.log('  Password: RecyclerPassword123!');
    console.log('Community User Account:');
    console.log('  Email:    user@ecoconnect.org');
    console.log('  Password: UserPassword123!');
    console.log('Pending Recycler Account:');
    console.log('  Email:    contact@metroescrap.com');
    console.log('  Password: RecyclerPassword123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
