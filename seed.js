require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/job');
const Company = require('./models/company');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Job.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Drop indexes to avoid conflicts
    try {
      await Company.collection.dropIndexes();
      await User.collection.dropIndexes();
      await Job.collection.dropIndexes();
      console.log('✅ Dropped old indexes');
    } catch (err) {
      console.log('⚠️  No indexes to drop');
    }

    // Create sample companies with explicit slugs
    const companies = await Company.insertMany([
      {
        name: 'Google',
        slug: 'google',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        industry: 'Technology',
        employees: '10,000+',
        description: 'Global technology leader in search, advertising, and cloud services',
        website: 'https://www.google.com',
        featured: true,
        isActive: true
      },
      {
        name: 'Microsoft',
        slug: 'microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        industry: 'Technology',
        employees: '10,000+',
        description: 'Leading technology company providing software and services',
        website: 'https://www.microsoft.com',
        featured: true,
        isActive: true
      },
      {
        name: 'Apple',
        slug: 'apple',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        industry: 'Technology',
        employees: '10,000+',
        description: 'Innovative technology company creating consumer electronics',
        website: 'https://www.apple.com',
        featured: true,
        isActive: true
      },
      {
        name: 'Amazon',
        slug: 'amazon',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        industry: 'E-commerce & Cloud',
        employees: '10,000+',
        description: 'E-commerce and cloud computing giant',
        website: 'https://www.amazon.com',
        featured: true,
        isActive: true
      },
      {
        name: 'Tesla',
        slug: 'tesla',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg',
        industry: 'Automotive',
        employees: '5000-10000',
        description: 'Electric vehicle and clean energy company',
        website: 'https://www.tesla.com',
        featured: true,
        isActive: true
      }
    ]);
    console.log('✅ Created 5 companies');

    // Create sample admin user
    const adminUser = await User.create({
      surname: 'Admin',
      name: 'System',
      email: 'admin@whitecollarsjobs.com',
      password: 'admin123',
      qualification: 'MBA',
      age: 30,
      experience: 'yes',
      experienceYears: 5,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Created admin user');

    // Create sample jobs
    const jobs = await Job.insertMany([
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        companyRef: companies[0]._id,
        department: 'Engineering',
        location: 'Bengaluru, India',
        locationType: 'Hybrid',
        description: 'Join Google as a Senior Software Engineer to build innovative products used by billions worldwide. Work on cutting-edge technologies including AI, cloud computing, and distributed systems. Collaborate with talented engineers and contribute to projects that impact users globally.',
        requirements: [
          '5+ years of software development experience',
          'Strong proficiency in Java, Python, or C++',
          'Experience with distributed systems',
          'Bachelor\'s degree in Computer Science or related field'
        ],
        responsibilities: [
          'Design and develop scalable software solutions',
          'Collaborate with cross-functional teams',
          'Mentor junior engineers',
          'Participate in code reviews'
        ],
        category: 'Software Development',
        employmentType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: {
          min: 2000000,
          max: 3500000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['Java', 'Python', 'System Design', 'Cloud Computing'],
        educationRequired: 'Bachelor\'s in Computer Science',
        postedBy: adminUser._id,
        active: true,
        featured: true,
        tags: ['engineering', 'backend', 'cloud']
      },
      {
        title: 'Product Manager',
        company: 'Microsoft',
        companyRef: companies[1]._id,
        department: 'Product',
        location: 'Hyderabad, India',
        locationType: 'Hybrid',
        description: 'Lead product strategy for Microsoft\'s enterprise solutions. Work with engineering, design, and business teams to build products that empower organizations worldwide. Drive innovation and customer satisfaction.',
        requirements: [
          '3+ years of product management experience',
          'Strong analytical and problem-solving skills',
          'Experience with enterprise software',
          'MBA or related degree preferred'
        ],
        responsibilities: [
          'Define product roadmap and strategy',
          'Collaborate with stakeholders',
          'Analyze market trends',
          'Drive product launches'
        ],
        category: 'Product Management',
        employmentType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: {
          min: 1800000,
          max: 3000000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Communication'],
        educationRequired: 'MBA or Bachelor\'s degree',
        postedBy: adminUser._id,
        active: true,
        featured: true,
        tags: ['product', 'strategy', 'enterprise']
      },
      {
        title: 'UI/UX Designer',
        company: 'Apple',
        companyRef: companies[2]._id,
        department: 'Design',
        location: 'Remote',
        locationType: 'Remote',
        description: 'Create beautiful, intuitive user experiences for Apple products. Join a world-class design team focused on innovation and user-centered design principles.',
        requirements: [
          '4+ years of UI/UX design experience',
          'Strong portfolio demonstrating design skills',
          'Proficiency in Figma, Sketch, Adobe Creative Suite',
          'Understanding of iOS design guidelines'
        ],
        responsibilities: [
          'Design user interfaces for iOS applications',
          'Create wireframes and prototypes',
          'Conduct user research',
          'Collaborate with engineering teams'
        ],
        category: 'Design & UI/UX',
        employmentType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: {
          min: 1500000,
          max: 2500000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
        educationRequired: 'Bachelor\'s in Design',
        postedBy: adminUser._id,
        active: true,
        featured: true,
        tags: ['design', 'ui', 'ux']
      },
      {
        title: 'Data Scientist',
        company: 'Amazon',
        companyRef: companies[3]._id,
        department: 'Data Science',
        location: 'Mumbai, India',
        locationType: 'On-site',
        description: 'Apply machine learning and data science to solve complex business problems at Amazon. Work with massive datasets to drive insights and build predictive models.',
        requirements: [
          'MS/PhD in Computer Science or Statistics',
          '3+ years of data science experience',
          'Strong Python and SQL skills',
          'Experience with ML frameworks'
        ],
        responsibilities: [
          'Build and deploy ML models',
          'Analyze large datasets',
          'Present insights to stakeholders',
          'Optimize recommendation systems'
        ],
        category: 'Data & Analytics',
        employmentType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: {
          min: 2000000,
          max: 3200000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
        educationRequired: 'MS/PhD in quantitative field',
        postedBy: adminUser._id,
        active: true,
        featured: true,
        tags: ['data', 'ml', 'python']
      },
      {
        title: 'Mechanical Engineer',
        company: 'Tesla',
        companyRef: companies[4]._id,
        department: 'Engineering',
        location: 'Pune, India',
        locationType: 'On-site',
        description: 'Design and develop mechanical systems for Tesla vehicles. Work on innovative automotive engineering projects in sustainable transportation.',
        requirements: [
          'Bachelor\'s in Mechanical Engineering',
          '2+ years of automotive experience',
          'CAD proficiency (SolidWorks, CATIA)',
          'Knowledge of manufacturing processes'
        ],
        responsibilities: [
          'Design mechanical components',
          'Perform stress analysis',
          'Collaborate with manufacturing',
          'Conduct testing and validation'
        ],
        category: 'Engineering (Core)',
        employmentType: 'Full-time',
        experienceLevel: 'Entry Level',
        salary: {
          min: 800000,
          max: 1500000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['CAD', 'Mechanical Design', 'Manufacturing'],
        educationRequired: 'B.Tech in Mechanical Engineering',
        postedBy: adminUser._id,
        active: true,
        featured: false,
        tags: ['mechanical', 'automotive']
      },
      {
        title: 'Marketing Manager',
        company: 'Google',
        companyRef: companies[0]._id,
        department: 'Marketing',
        location: 'Gurgaon, India',
        locationType: 'Hybrid',
        description: 'Lead marketing initiatives for Google\'s enterprise products. Develop go-to-market strategies and drive product adoption.',
        requirements: [
          '5+ years of B2B marketing experience',
          'Strong digital marketing knowledge',
          'Experience with enterprise software',
          'Excellent communication skills'
        ],
        responsibilities: [
          'Develop marketing strategies',
          'Manage campaigns',
          'Analyze market trends',
          'Work with sales teams'
        ],
        category: 'Marketing & Sales',
        employmentType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: {
          min: 1500000,
          max: 2500000,
          currency: 'INR',
          period: 'Yearly'
        },
        skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
        educationRequired: 'MBA in Marketing',
        postedBy: adminUser._id,
        active: true,
        featured: false,
        tags: ['marketing', 'b2b']
      }
    ]);
    console.log(`✅ Created ${jobs.length} jobs`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Companies: ${companies.length}`);
    console.log(`💼 Jobs: ${jobs.length}`);
    console.log(`👤 Users: 1`);
    console.log('\n📧 Admin Login Credentials:');
    console.log('   Email: admin@whitecollarsjobs.com');
    console.log('   Password: admin123\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
