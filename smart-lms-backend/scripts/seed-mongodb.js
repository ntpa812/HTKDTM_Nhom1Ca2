require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

// Kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_lms';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection failed:', err));

// ============================================
// SCHEMAS (FIXED)
// ============================================

// Material sub-schema
const materialSchema = new mongoose.Schema({
    type: String,
    url: String,
    description: String
}, { _id: false });

// Quiz question sub-schema
const quizQuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
}, { _id: false });

// Course Content Schema
const courseContentSchema = new mongoose.Schema({
    courseId: Number,
    courseName: String,
    lessonId: Number,
    lessonTitle: String,
    contentType: String,
    content: {
        text: String,
        videoUrl: String,
        duration: Number,
        difficulty: String,
    },
    materials: [materialSchema],  // ← FIX: Use sub-schema
    quiz: {
        questions: [quizQuestionSchema]  // ← FIX: Use sub-schema
    },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

// User Activity Logs
const activityLogSchema = new mongoose.Schema({
    userId: Number,
    username: String,
    action: String,
    resourceType: String,
    resourceId: Number,
    metadata: {
        duration: Number,
        score: Number,
        progress: Number,
        device: String,
        browser: String
    },
    timestamp: { type: Date, default: Date.now }
});

// Knowledge Tracing Data
const knowledgeStateSchema = new mongoose.Schema({
    userId: Number,
    courseId: Number,
    conceptId: String,
    masteryLevel: Number,
    attempts: Number,
    lastPracticed: Date,
    strengthHistory: [Number],
    updatedAt: { type: Date, default: Date.now }
});

const CourseContent = mongoose.model('CourseContent', courseContentSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
const KnowledgeState = mongoose.model('KnowledgeState', knowledgeStateSchema);

// ============================================
// SEED FUNCTIONS (FIXED)
// ============================================

async function seedCourseContents() {
    console.log('\n📚 Seeding Course Contents...');

    const courseIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const contentTypes = ['video', 'article', 'quiz', 'assignment'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const courseNames = [
        'JavaScript Fundamentals', 'Python for Beginners', 'Java Programming',
        'C++ Advanced', 'TypeScript Mastery', 'Python for Data Science',
        'Data Visualization', 'SQL for Data Analysis', 'Statistics Fundamentals',
        'Machine Learning Basics', 'Deep Learning with TensorFlow', 'Natural Language Processing',
        'Computer Vision', 'React.js Fundamentals', 'Node.js Backend Development',
        'Full-Stack Web Development', 'MongoDB Essentials', 'PostgreSQL Advanced',
        'Docker & Kubernetes', 'CI/CD with Jenkins'
    ];

    const contents = [];

    for (let i = 0; i < courseIds.length; i++) {
        const courseId = courseIds[i];
        const lessonsCount = faker.number.int({ min: 10, max: 15 });

        for (let lessonId = 1; lessonId <= lessonsCount; lessonId++) {
            const contentType = faker.helpers.arrayElement(contentTypes);

            // Create materials array properly
            const materialsArray = [];
            const materialCount = faker.number.int({ min: 1, max: 3 });
            for (let m = 0; m < materialCount; m++) {
                materialsArray.push({
                    type: faker.helpers.arrayElement(['pdf', 'slide', 'code', 'exercise']),
                    url: faker.internet.url(),
                    description: faker.lorem.sentence()
                });
            }

            // Create quiz questions properly
            let quizQuestions = null;
            if (contentType === 'quiz') {
                quizQuestions = [];
                for (let q = 0; q < 5; q++) {
                    quizQuestions.push({
                        question: faker.lorem.sentence() + '?',
                        options: [
                            faker.lorem.words(3),
                            faker.lorem.words(3),
                            faker.lorem.words(3),
                            faker.lorem.words(3)
                        ],
                        correctAnswer: faker.number.int({ min: 0, max: 3 }),
                        explanation: faker.lorem.sentence()
                    });
                }
            }

            const content = {
                courseId,
                courseName: courseNames[i] || `Course ${courseId}`,
                lessonId,
                lessonTitle: `Lesson ${lessonId}: ${faker.lorem.words(4)}`,
                contentType,
                content: {
                    text: contentType === 'article' ? faker.lorem.paragraphs(3) : faker.lorem.paragraph(),
                    videoUrl: contentType === 'video' ? `https://youtube.com/watch?v=${faker.string.alphanumeric(11)}` : null,
                    duration: faker.number.int({ min: 5, max: 60 }),
                    difficulty: faker.helpers.arrayElement(difficulties)
                },
                materials: materialsArray,
                quiz: quizQuestions ? { questions: quizQuestions } : undefined,
                tags: [
                    faker.lorem.word(),
                    faker.lorem.word(),
                    faker.lorem.word()
                ],
                createdAt: faker.date.past({ years: 0.5 })
            };

            contents.push(content);
        }
    }

    await CourseContent.deleteMany({});
    const result = await CourseContent.insertMany(contents);
    console.log(`✅ Inserted ${result.length} course contents`);
}

async function seedActivityLogs() {
    console.log('\n📊 Seeding Activity Logs...');

    const studentIds = Array.from({ length: 30 }, (_, i) => i + 5);
    const actions = ['login', 'logout', 'video_watch', 'video_pause', 'quiz_attempt', 'quiz_complete', 'course_enroll', 'lesson_complete'];
    const resourceTypes = ['course', 'lesson', 'quiz', 'video'];
    const devices = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];

    const logs = [];

    for (const userId of studentIds) {
        const logsCount = faker.number.int({ min: 50, max: 150 });

        for (let i = 0; i < logsCount; i++) {
            const action = faker.helpers.arrayElement(actions);

            const log = {
                userId,
                username: `student${String(userId - 4).padStart(2, '0')}`,
                action,
                resourceType: faker.helpers.arrayElement(resourceTypes),
                resourceId: faker.number.int({ min: 1, max: 20 }),
                metadata: {
                    duration: action.includes('watch') ? faker.number.int({ min: 1, max: 60 }) : undefined,
                    score: action.includes('quiz') ? faker.number.float({ min: 60, max: 100, fractionDigits: 1 }) : undefined,
                    progress: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
                    device: faker.helpers.arrayElement(devices),
                    browser: faker.helpers.arrayElement(browsers)
                },
                timestamp: faker.date.recent({ days: 90 })
            };

            logs.push(log);
        }
    }

    await ActivityLog.deleteMany({});
    const result = await ActivityLog.insertMany(logs);
    console.log(`✅ Inserted ${result.length} activity logs`);
}

async function seedKnowledgeStates() {
    console.log('\n🧠 Seeding Knowledge States...');

    const studentIds = Array.from({ length: 30 }, (_, i) => i + 5);
    const courseIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const concepts = [
        'variables', 'loops', 'functions', 'classes', 'algorithms',
        'data_structures', 'oop', 'recursion', 'sorting', 'searching',
        'graphs', 'trees', 'dynamic_programming', 'complexity_analysis',
        'databases', 'apis', 'testing', 'debugging'
    ];

    const states = [];

    for (const userId of studentIds) {
        const enrolledCourses = faker.helpers.arrayElements(courseIds, faker.number.int({ min: 1, max: 4 }));

        for (const courseId of enrolledCourses) {
            const courseConcepts = faker.helpers.arrayElements(concepts, faker.number.int({ min: 5, max: 10 }));

            for (const conceptId of courseConcepts) {
                const attempts = faker.number.int({ min: 1, max: 15 });
                const masteryLevel = faker.number.float({ min: 40, max: 98, fractionDigits: 1 });

                // Generate strength history
                const strengthHistory = [];
                let currentStrength = faker.number.float({ min: 20, max: 40, fractionDigits: 1 });
                for (let i = 0; i < attempts; i++) {
                    const improvement = faker.number.float({ min: 2, max: 8, fractionDigits: 1 });
                    currentStrength = Math.min(100, currentStrength + improvement);
                    strengthHistory.push(parseFloat(currentStrength.toFixed(1)));
                }

                const state = {
                    userId,
                    courseId,
                    conceptId,
                    masteryLevel,
                    attempts,
                    lastPracticed: faker.date.recent({ days: 30 }),
                    strengthHistory,
                    updatedAt: faker.date.recent({ days: 7 })
                };

                states.push(state);
            }
        }
    }

    await KnowledgeState.deleteMany({});
    const result = await KnowledgeState.insertMany(states);
    console.log(`✅ Inserted ${result.length} knowledge states`);
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
    console.log('🚀 Starting MongoDB Data Seeding...\n');
    console.log(`📡 Connected to: ${MONGODB_URI}\n`);

    try {
        await seedCourseContents();
        await seedActivityLogs();
        await seedKnowledgeStates();

        console.log('\n✅ All data seeded successfully!');
        console.log('\n📊 Summary:');
        const contentCount = await CourseContent.countDocuments();
        const logCount = await ActivityLog.countDocuments();
        const stateCount = await KnowledgeState.countDocuments();

        console.log(`   - Course Contents: ${contentCount} documents`);
        console.log(`   - Activity Logs: ${logCount} documents`);
        console.log(`   - Knowledge States: ${stateCount} documents`);

        // Sample data
        console.log('\n📝 Sample Course Content:');
        const sampleContent = await CourseContent.findOne();
        console.log(JSON.stringify(sampleContent, null, 2).substring(0, 300) + '...');

    } catch (error) {
        console.error('\n❌ Error seeding data:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Run the script
main();
