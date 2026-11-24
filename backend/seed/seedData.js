const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Enquiry = require('../models/Enquiry');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusswap');
    console.log('[Seed] Connected to MongoDB');

    // Wipe existing collections
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Enquiry.deleteMany({});
    console.log('[Seed] Cleared existing records');

    // 1. Create 3 realistic Indian B.Tech Students
    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu.in',
      password: 'password123',
      department: 'B.Tech CSE',
      year: '2nd Year',
      hostelOrLocation: 'Boys Hostel Block A',
      contactPreference: 'WhatsApp',
      phoneOrHandle: '+91 98765 43210',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@college.edu.in',
      password: 'password123',
      department: 'B.Tech ECE',
      year: '3rd Year',
      hostelOrLocation: 'Girls Hostel Block B',
      contactPreference: 'WhatsApp',
      phoneOrHandle: '+91 91234 56789',
    });

    const student3 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.verma@college.edu.in',
      password: 'password123',
      department: 'B.Tech Mechanical',
      year: '1st Year',
      hostelOrLocation: 'Main Campus Day Scholar',
      contactPreference: 'Email',
      phoneOrHandle: 'rohan.verma@college.edu.in',
    });

    console.log('[Seed] Created 3 students (Aarav, Priya, Rohan)');

    // 2. Create 8 realistic college listings with prices in INR (₹)
    const listings = await Listing.create([
      {
        title: 'B.S. Grewal - Higher Engineering Mathematics (44th Ed.)',
        description: 'Standard textbook for 1st & 2nd year engineering maths. Clean pages, no torn leaves, minimal pencil highlights.',
        price: 450,
        category: 'Books',
        condition: 'Like New',
        listingType: 'For Sale',
        status: 'Available',
        location: 'Boys Hostel Block A',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'],
        seller: student1._id,
      },
      {
        title: 'Casio fx-991ES Plus Scientific Calculator (2nd Gen)',
        description: 'Allowed in university semester exams. Matrix, integration, complex numbers & equation solver work perfectly. Fresh battery inserted.',
        price: 850,
        category: 'Electronics',
        condition: 'Good',
        listingType: 'For Sale',
        status: 'Available',
        location: 'Girls Hostel Block B',
        images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80'],
        seller: student2._id,
      },
      {
        title: 'Omega Mini Engineering Drafter + Roll-N-Draw Ruler',
        description: 'Complete Engineering Graphics kit used for 1st year ED drawing sheet submissions. Comes with clamp, protractor arms and protective canvas bag.',
        price: 350,
        category: 'Stationery',
        condition: 'Good',
        listingType: 'For Sale',
        status: 'Available',
        location: 'Main Campus Day Scholar',
        images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'],
        seller: student3._id,
      },
      {
        title: 'Foldable Wooden Hostel Study Bed-Table with Cup Holder',
        description: 'Ergonomic bed desk for studying late nights in hostel rooms. Solid MDF board, foldable metal legs, tablet & pen slot included.',
        price: 400,
        category: 'Furniture',
        condition: 'Like New',
        listingType: 'For Sale',
        status: 'Available',
        location: 'Boys Hostel Block A',
        images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80'],
        seller: student1._id,
      },
      {
        title: 'Arduino Uno R3 Starter Kit with Sensors & Jumper Wires',
        description: 'Ideal for IoT and microcontroller lab assignments. Includes Uno board, breadboard, ultrasonic sensor, IR sensor, LEDs, and USB cable.',
        price: 900,
        category: 'Electronics',
        condition: 'Like New',
        listingType: 'For Sale',
        status: 'Available',
        location: 'Girls Hostel Block B',
        images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80'],
        seller: student2._id,
      },
      {
        title: 'First Year Engineering Physics Lab Manual & Solved Notes',
        description: 'Completed and verified lab manual with all 10 circuit & optics experiments. Donating for free to any junior who needs reference values.',
        price: 0,
        category: 'Books',
        condition: 'Fair',
        listingType: 'Free',
        status: 'Available',
        location: 'Boys Hostel Block A',
        images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'],
        seller: student1._id,
      },
      {
        title: '7-in-1 Type-C Multiport Hub (HDMI 4K, USB 3.0, SD Card)',
        description: 'Aluminum hub for thin laptops without ports. Looking to trade for an adjustable aluminum laptop cooling stand or mechanical keyboard.',
        price: 0,
        category: 'Electronics',
        condition: 'Like New',
        listingType: 'Exchange',
        exchangePreference: 'Adjustable Laptop Stand or Wireless Mouse',
        status: 'Available',
        location: 'Girls Hostel Block B',
        images: ['https://images.unsplash.com/photo-1588797303983-22572d16c403?auto=format&fit=crop&w=600&q=80'],
        seller: student2._id,
      },
      {
        title: 'Rechargeable LED Desk Study Lamp (3 Color Temperatures)',
        description: 'Touch control desk lamp with 2000mAh backup. Great for hostel power cuts during exams. USB charging cable included.',
        price: 300,
        category: 'Other',
        condition: 'Good',
        listingType: 'For Sale',
        status: 'Reserved',
        location: 'Main Campus Day Scholar',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'],
        seller: student3._id,
      },
    ]);

    console.log(`[Seed] Seeded ${listings.length} realistic campus marketplace items`);

    // 3. Create 2 sample enquiries for immediate viva demonstration
    await Enquiry.create([
      {
        listing: listings[0]._id,
        buyer: student2._id,
        seller: student1._id,
        message: 'Hi Aarav, can I pick this up today around 6 PM from Block A reception? Would you take ₹400?',
        offerPrice: 400,
        status: 'Pending',
        isReadByBuyer: true,
      },
      {
        listing: listings[7]._id,
        buyer: student1._id,
        seller: student3._id,
        message: 'Hey Rohan, I need this lamp for mid-term prep tonight. Is ₹280 fine?',
        offerPrice: 280,
        status: 'Accepted',
        sellerReplyNote: 'Accepted! Meet me at library gate by 5:30 PM.',
        isReadByBuyer: false,
      },
    ]);

    console.log('[Seed] Seeded 2 enquiries (1 Pending, 1 Accepted with unread alert)');
    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
