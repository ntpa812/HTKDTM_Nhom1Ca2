USE SMART_LMS;

GO

--Xóa dữ liệu cũ
DELETE FROM RECOMMENDATIONS;

DELETE FROM ANALYTICS;

DELETE FROM PROGRESS;

DELETE FROM ENROLLMENTS;

DELETE FROM COURSES;

DELETE FROM USERS;

GO

--Reset identity
DBCC CHECKIDENT('Users', RESEED, 0);

DBCC CHECKIDENT('Courses', RESEED, 0);

DBCC CHECKIDENT('Enrollments', RESEED, 0);

DBCC CHECKIDENT('Progress', RESEED, 0);

GO

-- ============================================
--1. INSERT 30 STUDENTS + 3 INSTRUCTORS + 1 ADMIN
-- ============================================

INSERT INTO USERS(
    USERNAME,
    EMAIL,
    PASSWORD,
    FULL_NAME,
    ROLE,
    LEARNING_STYLE,
    CREATED_AT
) VALUES
 --Admin
(
    'admin',
    'admin@smartlms.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Admin User',
    'admin',
    'visual',
    GETDATE()
),
 
--Instructors
(
    'instructor1',
    'instructor1@smartlms.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Dr. Nguyễn Văn Minh',
    'instructor',
    'visual',
    GETDATE()
),
(
    'instructor2',
    'instructor2@smartlms.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'ThS. Trần Thị Hương',
    'instructor',
    'auditory',
    GETDATE()
),
(
    'instructor3',
    'instructor3@smartlms.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'TS. Lê Hoàng Nam',
    'instructor',
    'kinesthetic',
    GETDATE()
),
 
--30 Students
(
    'student01',
    'student01@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Nguyễn Văn An',
    'student',
    'visual',
    DATEADD(DAY, -90, GETDATE())
),
(
    'student02',
    'student02@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Trần Thị Bình',
    'student',
    'auditory',
    DATEADD(DAY, -85, GETDATE())
),
(
    'student03',
    'student03@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Lê Hoàng Cường',
    'student',
    'kinesthetic',
    DATEADD(DAY, -80, GETDATE())
),
(
    'student04',
    'student04@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Phạm Minh Đức',
    'student',
    'visual',
    DATEADD(DAY, -75, GETDATE())
),
(
    'student05',
    'student05@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Võ Thị Em',
    'student',
    'reading',
    DATEADD(DAY, -70, GETDATE())
),
(
    'student06',
    'student06@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Hoàng Văn Phong',
    'student',
    'visual',
    DATEADD(DAY, -65, GETDATE())
),
(
    'student07',
    'student07@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Đặng Thị Giang',
    'student',
    'auditory',
    DATEADD(DAY, -60, GETDATE())
),
(
    'student08',
    'student08@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Bùi Văn Hải',
    'student',
    'kinesthetic',
    DATEADD(DAY, -55, GETDATE())
),
(
    'student09',
    'student09@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Ngô Thị Lan',
    'student',
    'visual',
    DATEADD(DAY, -50, GETDATE())
),
(
    'student10',
    'student10@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Dương Văn Kiên',
    'student',
    'reading',
    DATEADD(DAY, -45, GETDATE())
),
(
    'student11',
    'student11@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Phan Thị Mai',
    'student',
    'visual',
    DATEADD(DAY, -40, GETDATE())
),
(
    'student12',
    'student12@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Lý Văn Nam',
    'student',
    'auditory',
    DATEADD(DAY, -35, GETDATE())
),
(
    'student13',
    'student13@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Trương Thị Oanh',
    'student',
    'kinesthetic',
    DATEADD(DAY, -30, GETDATE())
),
(
    'student14',
    'student14@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Vũ Văn Phúc',
    'student',
    'visual',
    DATEADD(DAY, -25, GETDATE())
),
(
    'student15',
    'student15@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Đỗ Thị Quỳnh',
    'student',
    'reading',
    DATEADD(DAY, -20, GETDATE())
),
(
    'student16',
    'student16@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Cao Văn Sơn',
    'student',
    'visual',
    DATEADD(DAY, -15, GETDATE())
),
(
    'student17',
    'student17@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Mai Thị Trang',
    'student',
    'auditory',
    DATEADD(DAY, -10, GETDATE())
),
(
    'student18',
    'student18@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Đinh Văn Tuấn',
    'student',
    'kinesthetic',
    DATEADD(DAY, -5, GETDATE())
),
(
    'student19',
    'student19@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Hồ Thị Uyên',
    'student',
    'visual',
    DATEADD(DAY, -3, GETDATE())
),
(
    'student20',
    'student20@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Chu Văn Vinh',
    'student',
    'reading',
    DATEADD(DAY, -2, GETDATE())
),
(
    'student21',
    'student21@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Lưu Thị Xuân',
    'student',
    'visual',
    DATEADD(DAY, -88, GETDATE())
),
(
    'student22',
    'student22@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Tô Văn Yến',
    'student',
    'auditory',
    DATEADD(DAY, -77, GETDATE())
),
(
    'student23',
    'student23@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Đàm Thị An',
    'student',
    'kinesthetic',
    DATEADD(DAY, -66, GETDATE())
),
(
    'student24',
    'student24@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Tạ Văn Bảo',
    'student',
    'visual',
    DATEADD(DAY, -55, GETDATE())
),
(
    'student25',
    'student25@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Lâm Thị Chi',
    'student',
    'reading',
    DATEADD(DAY, -44, GETDATE())
),
(
    'student26',
    'student26@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Từ Văn Đạt',
    'student',
    'visual',
    DATEADD(DAY, -33, GETDATE())
),
(
    'student27',
    'student27@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Hà Thị Nga',
    'student',
    'auditory',
    DATEADD(DAY, -22, GETDATE())
),
(
    'student28',
    'student28@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Lại Văn Phát',
    'student',
    'kinesthetic',
    DATEADD(DAY, -11, GETDATE())
),
(
    'student29',
    'student29@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Nghiêm Thị Quế',
    'student',
    'visual',
    DATEADD(DAY, -7, GETDATE())
),
(
    'student30',
    'student30@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkC',
    N'Ông Văn Tài',
    'student',
    'reading',
    DATEADD(DAY, -4, GETDATE())
);

GO

-- ============================================
--2. INSERT 20 COURSES
-- ============================================

INSERT INTO COURSES(
    TITLE,
    DESCRIPTION,
    DIFFICULTY,
    DURATION_HOURS,
    INSTRUCTOR_ID,
    CATEGORY,
    CREATED_AT
) VALUES
 --Programming(Instructor 2)
(
    N'JavaScript Fundamentals',
    N'Master JavaScript from basics to advanced concepts',
    'Beginner',
    24,
    2,
    'Programming',
    DATEADD(DAY, -120, GETDATE())
),
(
    N'Python for Beginners',
    N'Learn Python programming step by step',
    'Beginner',
    20,
    2,
    'Programming',
    DATEADD(DAY, -115, GETDATE())
),
(
    N'Java Programming',
    N'Comprehensive Java course for developers',
    'Intermediate',
    36,
    2,
    'Programming',
    DATEADD(DAY, -110, GETDATE())
),
(
    N'C++ Advanced',
    N'Deep dive into C++ programming',
    'Advanced',
    40,
    2,
    'Programming',
    DATEADD(DAY, -105, GETDATE())
),
(
    N'TypeScript Mastery',
    N'Modern TypeScript for web development',
    'Intermediate',
    28,
    2,
    'Programming',
    DATEADD(DAY, -100, GETDATE())
),
 
--Data Science(Instructor 3)
(
    N'Python for Data Science',
    N'Data analysis with Python, Pandas, NumPy',
    'Intermediate',
    32,
    3,
    'Data Science',
    DATEADD(DAY, -95, GETDATE())
),
(
    N'Data Visualization',
    N'Create stunning visualizations with Matplotlib',
    'Intermediate',
    24,
    3,
    'Data Science',
    DATEADD(DAY, -90, GETDATE())
),
(
    N'SQL for Data Analysis',
    N'Master SQL queries for data professionals',
    'Beginner',
    20,
    3,
    'Data Science',
    DATEADD(DAY, -85, GETDATE())
),
(
    N'Statistics Fundamentals',
    N'Essential statistics for data science',
    'Beginner',
    28,
    3,
    'Data Science',
    DATEADD(DAY, -80, GETDATE())
),
 
--AI / ML(Instructor 4)
(
    N'Machine Learning Basics',
    N'Introduction to ML algorithms',
    'Intermediate',
    40,
    4,
    'AI/ML',
    DATEADD(DAY, -75, GETDATE())
),
(
    N'Deep Learning with TensorFlow',
    N'Neural networks and deep learning',
    'Advanced',
    48,
    4,
    'AI/ML',
    DATEADD(DAY, -70, GETDATE())
),
(
    N'Natural Language Processing',
    N'NLP techniques and applications',
    'Advanced',
    36,
    4,
    'AI/ML',
    DATEADD(DAY, -65, GETDATE())
),
(
    N'Computer Vision',
    N'Image processing and CV algorithms',
    'Advanced',
    44,
    4,
    'AI/ML',
    DATEADD(DAY, -60, GETDATE())
),
 
--Web Development(Instructor 2)
(
    N'React.js Fundamentals',
    N'Build modern UIs with React',
    'Intermediate',
    32,
    2,
    'Web Development',
    DATEADD(DAY, -55, GETDATE())
),
(
    N'Node.js Backend Development',
    N'Server-side JavaScript with Node',
    'Intermediate',
    36,
    2,
    'Web Development',
    DATEADD(DAY, -50, GETDATE())
),
(
    N'Full-Stack Web Development',
    N'Complete web development bootcamp',
    'Advanced',
    60,
    2,
    'Web Development',
    DATEADD(DAY, -45, GETDATE())
),
 
--Database(Instructor 3)
(
    N'MongoDB Essentials',
    N'NoSQL database with MongoDB',
    'Beginner',
    20,
    3,
    'Database',
    DATEADD(DAY, -40, GETDATE())
),
(
    N'PostgreSQL Advanced',
    N'Advanced database design and optimization',
    'Advanced',
    32,
    3,
    'Database',
    DATEADD(DAY, -35, GETDATE())
),
 
--DevOps(Instructor 2)
(
    N'Docker & Kubernetes',
    N'Containerization and orchestration',
    'Intermediate',
    28,
    2,
    'DevOps',
    DATEADD(DAY, -30, GETDATE())
),
(
    N'CI/CD with Jenkins',
    N'Continuous integration and deployment',
    'Intermediate',
    24,
    2,
    'DevOps',
    DATEADD(DAY, -25, GETDATE())
);

GO

-- ============================================
--3. INSERT 50 ENROLLMENTS(phân bố đều)
-- ============================================

INSERT INTO ENROLLMENTS(
    USER_ID,
    COURSE_ID,
    ENROLLED_AT,
    PROGRESS,
    STATUS
) VALUES
 --Student 01 - 3 courses
(
    5,
    1,
    DATEADD(DAY, -90, GETDATE()),
    85.50,
    'active'
),
(
    5,
    6,
    DATEADD(DAY, -80, GETDATE()),
    65.30,
    'active'
),
(
    5,
    10,
    DATEADD(DAY, -70, GETDATE()),
    45.20,
    'active'
),
 
--Student 02 - 2 courses
(
    6,
    2,
    DATEADD(DAY, -85, GETDATE()),
    90.00,
    'active'
),
(
    6,
    14,
    DATEADD(DAY, -75, GETDATE()),
    72.40,
    'active'
),
 
--Student 03 - 3 courses
(
    7,
    3,
    DATEADD(DAY, -80, GETDATE()),
    55.60,
    'active'
),
(
    7,
    15,
    DATEADD(DAY, -70, GETDATE()),
    80.00,
    'active'
),
(
    7,
    10,
    DATEADD(DAY, -60, GETDATE()),
    30.00,
    'active'
),
 
--Student 04 - 2 courses
(
    8,
    1,
    DATEADD(DAY, -75, GETDATE()),
    95.50,
    'completed'
),
(
    8,
    6,
    DATEADD(DAY, -65, GETDATE()),
    88.70,
    'active'
),
 
--Student 05 - 2 courses
(
    9,
    8,
    DATEADD(DAY, -70, GETDATE()),
    76.30,
    'active'
),
(
    9,
    9,
    DATEADD(DAY, -60, GETDATE()),
    65.00,
    'active'
),
 
--Student 06 - 3 courses
(
    10,
    14,
    DATEADD(DAY, -65, GETDATE()),
    92.80,
    'active'
),
(
    10,
    15,
    DATEADD(DAY, -55, GETDATE()),
    70.50,
    'active'
),
(
    10,
    16,
    DATEADD(DAY, -45, GETDATE()),
    40.00,
    'active'
),
 
--Student 07 - 2 courses
(
    11,
    2,
    DATEADD(DAY, -60, GETDATE()),
    85.00,
    'active'
),
(
    11,
    7,
    DATEADD(DAY, -50, GETDATE()),
    60.00,
    'active'
),
 
--Student 08 - 2 courses
(
    12,
    10,
    DATEADD(DAY, -55, GETDATE()),
    78.90,
    'active'
),
(
    12,
    11,
    DATEADD(DAY, -45, GETDATE()),
    55.30,
    'active'
),
 
--Student 09 - 2 courses
(
    13,
    12,
    DATEADD(DAY, -50, GETDATE()),
    82.40,
    'active'
),
(
    13,
    13,
    DATEADD(DAY, -40, GETDATE()),
    50.00,
    'active'
),
 
--Student 10 - 3 courses
(
    14,
    5,
    DATEADD(DAY, -45, GETDATE()),
    70.00,
    'active'
),
(
    14,
    14,
    DATEADD(DAY, -35, GETDATE()),
    65.50,
    'active'
),
(
    14,
    19,
    DATEADD(DAY, -25, GETDATE()),
    45.00,
    'active'
),
 
--Students 11 - 20(2 courses each)
(
    15,
    3,
    DATEADD(DAY, -40, GETDATE()),
    88.00,
    'active'
),
(
    15,
    17,
    DATEADD(DAY, -30, GETDATE()),
    73.20,
    'active'
),
(
    16,
    6,
    DATEADD(DAY, -35, GETDATE()),
    92.50,
    'active'
),
(
    16,
    10,
    DATEADD(DAY, -25, GETDATE()),
    68.00,
    'active'
),
(
    17,
    1,
    DATEADD(DAY, -30, GETDATE()),
    75.80,
    'active'
),
(
    17,
    14,
    DATEADD(DAY, -20, GETDATE()),
    55.00,
    'active'
),
(
    18,
    4,
    DATEADD(DAY, -25, GETDATE()),
    60.30,
    'active'
),
(
    18,
    11,
    DATEADD(DAY, -15, GETDATE()),
    42.00,
    'active'
),
(
    19,
    15,
    DATEADD(DAY, -20, GETDATE()),
    95.00,
    'completed'
),
(
    19,
    16,
    DATEADD(DAY, -10, GETDATE()),
    80.00,
    'active'
),
(
    20,
    8,
    DATEADD(DAY, -15, GETDATE()),
    70.40,
    'active'
),
(
    20,
    18,
    DATEADD(DAY, -5, GETDATE()),
    35.00,
    'active'
),
(
    21,
    2,
    DATEADD(DAY, -10, GETDATE()),
    85.60,
    'active'
),
(
    21,
    19,
    DATEADD(DAY, -7, GETDATE()),
    50.00,
    'active'
),
(
    22,
    13,
    DATEADD(DAY, -12, GETDATE()),
    78.00,
    'active'
),
(
    22,
    20,
    DATEADD(DAY, -8, GETDATE()),
    62.00,
    'active'
),
(
    23,
    7,
    DATEADD(DAY, -14, GETDATE()),
    90.00,
    'active'
),
(
    23,
    9,
    DATEADD(DAY, -9, GETDATE()),
    72.00,
    'active'
),
(
    24,
    12,
    DATEADD(DAY, -16, GETDATE()),
    66.50,
    'active'
),
(
    24,
    17,
    DATEADD(DAY, -11, GETDATE()),
    48.00,
    'active'
),
 
--Students 25 - 30(1 - 2 courses each)
(
    25,
    5,
    DATEADD(DAY, -18, GETDATE()),
    82.30,
    'active'
),
(
    26,
    14,
    DATEADD(DAY, -20, GETDATE()),
    75.00,
    'active'
),
(
    27,
    10,
    DATEADD(DAY, -22, GETDATE()),
    68.90,
    'active'
),
(
    28,
    1,
    DATEADD(DAY, -24, GETDATE()),
    92.00,
    'active'
),
(
    29,
    3,
    DATEADD(DAY, -26, GETDATE()),
    58.40,
    'active'
),
(
    30,
    6,
    DATEADD(DAY, -28, GETDATE()),
    71.20,
    'active'
);

GO

-- ============================================
--4. INSERT PROGRESS DATA(knowledge tracing)
-- ============================================

--Student 01 progress
INSERT INTO PROGRESS(
    USER_ID,
    COURSE_ID,
    LESSON_ID,
    COMPLETED,
    SCORE,
    TIME_SPENT,
    COMPLETED_AT,
    CREATED_AT
)
    SELECT
        5,
        1,
        LESSON_ID,
        CASE
            WHEN LESSON_ID <= 17 THEN
                1
            ELSE
                0
        END                                                        AS COMPLETED,
        CAST(75 + (RAND(CHECKSUM(NEWID())) * 20) AS DECIMAL(5, 2)) AS SCORE,
        CAST(20 + (RAND(CHECKSUM(NEWID())) * 40) AS INT)           AS TIME_SPENT,
        CASE
            WHEN LESSON_ID <= 17 THEN
                DATEADD(DAY, -90 + LESSON_ID, GETDATE())
            ELSE
                NULL
        END                                                        AS COMPLETED_AT,
        DATEADD(DAY, -90 + LESSON_ID, GETDATE())                   AS CREATED_AT
    FROM
        (
            SELECT
                1 AS LESSON_ID UNION
                SELECT
                    2 UNION
                    SELECT
                        3 UNION
                        SELECT
                            4 UNION
                            SELECT
                                5 UNION
                                SELECT
                                    6 UNION
                                    SELECT
                                        7 UNION
                                        SELECT
                                            8 UNION
                                            SELECT
                                                9 UNION
                                                SELECT
                                                    10 UNION
                                                    SELECT
                                                        11 UNION
                                                        SELECT
                                                            12 UNION
                                                            SELECT
                                                                13 UNION
                                                                SELECT
                                                                    14 UNION
                                                                    SELECT
                                                                        15 UNION
                                                                        SELECT
                                                                            16 UNION
                                                                            SELECT
                                                                                17 UNION
                                                                                SELECT
                                                                                    18 UNION
                                                                                    SELECT
                                                                                        19 UNION
                                                                                        SELECT
                                                                                            20
        ) LESSONS;

GO

--Similar progress for other top students
--(Có thể thêm nhiều hơn, nhưng để ngắn gọn)

-- ============================================
--5. INSERT ANALYTICS DATA
-- ============================================

--Learning events
INSERT INTO ANALYTICS(
    USER_ID,
    EVENT_TYPE,
    EVENT_DATA,
    TIMESTAMP
)
    SELECT
        5 + (ABS(CHECKSUM(NEWID())) % 26) AS USER_ID,
        EVENT_TYPE,
        '{"duration": ' + CAST(CAST(RAND(CHECKSUM(NEWID())) * 60 AS INT) AS VARCHAR) + ', "score": ' + CAST(CAST(70 + RAND(CHECKSUM(NEWID())) * 30 AS INT) AS VARCHAR) + '}' AS EVENT_DATA,
        DATEADD(MINUTE,
        -IDX * 30,
        GETDATE()) AS TIMESTAMP
    FROM
        (
            SELECT
                'video_watch' AS EVENT_TYPE UNION
                SELECT
                    'quiz_complete' UNION
                    SELECT
                        'lesson_complete' UNION
                        SELECT
                            'course_enroll' UNION
                            SELECT
                                'login'
        ) EVENTS
        CROSS JOIN(
            SELECT
                TOP 100 ROW_NUMBER() OVER(ORDER BY(
                    SELECT
                        NULL
                )) AS IDX
            FROM
                SYS.OBJECTS
        ) NUMBERS;

GO

-- ============================================
--6. INSERT AI RECOMMENDATIONS
-- ============================================

INSERT INTO RECOMMENDATIONS(
    USER_ID,
    COURSE_ID,
    SCORE,
    REASON,
    CREATED_AT
)
    SELECT
        5 + (ABS(CHECKSUM(NEWID())) % 26) AS USER_ID,
        1 + (ABS(CHECKSUM(NEWID())) % 20) AS COURSE_ID,
        CAST(60 + (RAND(CHECKSUM(NEWID())) * 40) AS DECIMAL(5,
        2)) AS SCORE,
        CASE(ABS(CHECKSUM(NEWID())) % 4)
            WHEN 0 THEN
                N'Based on your learning style'
            WHEN 1 THEN
                N'Similar to courses you completed'
            WHEN 2 THEN
                N'Trending in your category'
            ELSE
                N'Recommended by AI model'
        END AS REASON,
        DATEADD(HOUR,
        -IDX,
        GETDATE()) AS CREATED_AT
    FROM
        (
            SELECT
                TOP 50 ROW_NUMBER() OVER(ORDER BY(
                    SELECT
                        NULL
                )) AS IDX
            FROM
                SYS.OBJECTS
        ) NUMBERS;

GO

-- ============================================
--VERIFICATION QUERIES
-- ============================================

PRINT '=== DATA VERIFICATION ===';

SELECT
    'Users'           AS TABLENAME,
    COUNT(*)          AS RECORDCOUNT
FROM
    USERS
UNION
ALL
SELECT
    'Courses',
    COUNT(*)
FROM
    COURSES
UNION
ALL
SELECT
    'Enrollments',
    COUNT(*)
FROM
    ENROLLMENTS
UNION
ALL
SELECT
    'Progress',
    COUNT(*)
FROM
    PROGRESS
UNION
ALL
SELECT
    'Analytics',
    COUNT(*)
FROM
    ANALYTICS
UNION
ALL
SELECT
    'Recommendations',
    COUNT(*)
FROM
    RECOMMENDATIONS;

GO

--Top students by progress
SELECT
    TOP 10 U.FULL_NAME,
    COUNT(DISTINCT E.COURSE_ID) AS ENROLLED_COURSES,
    AVG(E.PROGRESS) AS AVG_PROGRESS
FROM
    USERS U
    JOIN ENROLLMENTS E
    ON U.ID = E.USER_ID
WHERE
    U.ROLE = 'student'
GROUP BY
    U.ID,
    U.FULL_NAME
ORDER BY
    AVG_PROGRESS DESC;

GO

-- =============================================
-- Sample Enrollments
INSERT INTO ENROLLMENTS (
    STUDENT_ID,
    COURSE_ID,
    STATUS,
    PROGRESS,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    1,
    1,
    'active',
    45,
    GETDATE(),
    GETDATE()
),
(
    1,
    2,
    'active',
    70,
    GETDATE(),
    GETDATE()
),
(
    1,
    3,
    'active',
    30,
    GETDATE(),
    GETDATE()
);

-- Sample Quiz Attempts
INSERT INTO QUIZATTEMPTS (
    QUIZ_ID,
    STUDENT_ID,
    SCORE,
    COMPLETED_AT,
    CREATED_AT
) VALUES (
    1,
    1,
    85,
    GETDATE(),
    GETDATE()
),
(
    2,
    1,
    90,
    GETDATE(),
    GETDATE()
),
(
    3,
    1,
    75,
    GETDATE(),
    GETDATE()
);

-- Sample Assignment Submissions
INSERT INTO ASSIGNMENTSUBMISSIONS (
    ASSIGNMENT_ID,
    STUDENT_ID,
    STATUS,
    SUBMITTED_AT,
    CREATED_AT
) VALUES (
    1,
    1,
    'submitted',
    GETDATE(),
    GETDATE()
),
(
    2,
    1,
    'submitted',
    GETDATE(),
    GETDATE()
);

-- ============================================

-- USE database
USE SMART_LMS;

GO

-- 1) LearningPaths: meta của Learning Path
CREATE TABLE DBO.LEARNINGPATHS (
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    TITLE NVARCHAR(200) NOT NULL,
    SLUG NVARCHAR(220) NOT NULL UNIQUE,
    DESCRIPTION NVARCHAR(MAX) NULL,
    CATEGORY NVARCHAR(100) NULL,
    DIFFICULTY NVARCHAR(30) NOT NULL CHECK (DIFFICULTY IN ('Beginner', 'Intermediate', 'Advanced')),
    ESTIMATED_HOURS INT NULL,
    IS_PUBLISHED BIT NOT NULL DEFAULT 0,
    OWNER_ID INT NOT NULL, -- FK Users(id)
    CREATED_AT DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UPDATED_AT DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

GO

-- 2) PathCourses: ánh xạ courses theo thứ tự trong path
CREATE TABLE DBO.PATHCOURSES (
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    PATH_ID INT NOT NULL, -- FK LearningPaths(id)
    COURSE_ID INT NOT NULL, -- FK Courses(id)
    POSITION INT NOT NULL, -- 1,2,3...
    MIN_SCORE_REQUIRED DECIMAL(5, 2) NULL, -- điều kiện mở khóa
    REQUIRE_QUIZ_COMPLETE BIT NOT NULL DEFAULT 0,
    REQUIRE_ASSIGNMENTS_COMPLETE BIT NOT NULL DEFAULT 0,
    ESTIMATED_HOURS INT NULL,
    CONSTRAINT UQ_PATHCOURSES_PATHCOURSE UNIQUE(PATH_ID, COURSE_ID),
    CONSTRAINT UQ_PATHCOURSES_PATHPOSITION UNIQUE(PATH_ID, POSITION)
);

GO

-- 3) PathEnrollments: sinh viên đăng ký path
CREATE TABLE DBO.PATHENROLLMENTS (
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    PATH_ID INT NOT NULL, -- FK LearningPaths(id)
    USER_ID INT NOT NULL, -- FK Users(id)
    STATUS NVARCHAR(30) NOT NULL DEFAULT 'active' CHECK (STATUS IN ('active', 'completed', 'dropped', 'paused')),
    ENROLLED_AT DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    COMPLETED_AT DATETIME2 NULL,
    LAST_ACTIVITY_AT DATETIME2 NULL,
    CONSTRAINT UQ_PATHENROLLMENTS UNIQUE(PATH_ID, USER_ID)
);

GO

-- 4) PathProgress: tiến độ từng course trong path của từng user
CREATE TABLE DBO.PATHPROGRESS (
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    PATH_ID INT NOT NULL, -- FK LearningPaths(id)
    USER_ID INT NOT NULL, -- FK Users(id)
    COURSE_ID INT NOT NULL, -- FK Courses(id)
    PROGRESS DECIMAL(5, 2) NOT NULL DEFAULT 0, -- 0..100
    SCORE DECIMAL(5, 2) NULL,
    TIME_SPENT_MINUTES INT NOT NULL DEFAULT 0,
    MILESTONES NVARCHAR(MAX) NULL, -- JSON text (tuỳ)
    LAST_UPDATED DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    COMPLETED BIT NOT NULL DEFAULT 0,
    CONSTRAINT UQ_PATHPROGRESS UNIQUE(PATH_ID, USER_ID, COURSE_ID)
);

GO

-- 5) Prerequisites: điều kiện tiên quyết (global hoặc theo path)
CREATE TABLE DBO.PREREQUISITES (
    ID INT IDENTITY(1, 1) PRIMARY KEY,
    PATH_ID INT NULL, -- NULL = global
    COURSE_ID INT NOT NULL,
    PREREQUISITE_COURSE_ID INT NOT NULL,
    MIN_SCORE_REQUIRED DECIMAL(5, 2) NULL,
    CONSTRAINT UQ_PREREQ UNIQUE(PATH_ID, COURSE_ID, PREREQUISITE_COURSE_ID)
);

GO

-- Khóa ngoại
ALTER TABLE DBO.LEARNINGPATHS
    ADD CONSTRAINT FK_LP_OWNER FOREIGN KEY (
        OWNER_ID
    )
        REFERENCES DBO.USERS(
            ID
        );

GO

ALTER TABLE DBO.PATHCOURSES
    ADD CONSTRAINT FK_PC_PATH FOREIGN KEY (
        PATH_ID
    )
        REFERENCES DBO.LEARNINGPATHS(
            ID
        ) ON DELETE CASCADE, CONSTRAINT FK_PC_COURSE FOREIGN KEY (
            COURSE_ID
        )
            REFERENCES DBO.COURSES(
                ID
            );

GO

ALTER TABLE DBO.PATHENROLLMENTS
    ADD CONSTRAINT FK_PE_PATH FOREIGN KEY (
        PATH_ID
    )
        REFERENCES DBO.LEARNINGPATHS(
            ID
        ) ON DELETE CASCADE, CONSTRAINT FK_PE_USER FOREIGN KEY (
            USER_ID
        )
            REFERENCES DBO.USERS(
                ID
            );

GO

ALTER TABLE DBO.PATHPROGRESS
    ADD CONSTRAINT FK_PP_PATH FOREIGN KEY (
        PATH_ID
    )
        REFERENCES DBO.LEARNINGPATHS(
            ID
        ) ON DELETE CASCADE, CONSTRAINT FK_PP_USER FOREIGN KEY (
            USER_ID
        )
            REFERENCES DBO.USERS(
                ID
            ), CONSTRAINT FK_PP_COURSE FOREIGN KEY (
                COURSE_ID
            )
                REFERENCES DBO.COURSES(
                    ID
                );

GO

ALTER TABLE DBO.PREREQUISITES
    ADD CONSTRAINT FK_PR_PATH FOREIGN KEY (
        PATH_ID
    )
        REFERENCES DBO.LEARNINGPATHS(
            ID
        ) ON DELETE CASCADE, CONSTRAINT FK_PR_COURSE FOREIGN KEY (
            COURSE_ID
        )
            REFERENCES DBO.COURSES(
                ID
            ), CONSTRAINT FK_PR_PRECOURSE FOREIGN KEY (
                PREREQUISITE_COURSE_ID
            )
                REFERENCES DBO.COURSES(
                    ID
                );

GO

-- Indexes tối ưu truy vấn list/filter/progress
CREATE INDEX IX_LP_CATEGORY ON DBO.LEARNINGPATHS(CATEGORY, DIFFICULTY);

CREATE INDEX IX_LP_PUBLISHED ON DBO.LEARNINGPATHS(IS_PUBLISHED, CREATED_AT DESC);

CREATE INDEX IX_PC_PATH ON DBO.PATHCOURSES(PATH_ID) INCLUDE (POSITION, COURSE_ID);

CREATE INDEX IX_PC_COURSE ON DBO.PATHCOURSES(COURSE_ID);

CREATE INDEX IX_PE_USER ON DBO.PATHENROLLMENTS(USER_ID, STATUS);

CREATE INDEX IX_PE_PATH ON DBO.PATHENROLLMENTS(PATH_ID, STATUS);

CREATE INDEX IX_PP_USERPATH ON DBO.PATHPROGRESS(USER_ID, PATH_ID);

CREATE INDEX IX_PP_PATHCOURSE ON DBO.PATHPROGRESS(PATH_ID, COURSE_ID);

CREATE INDEX IX_PP_UPDATED ON DBO.PATHPROGRESS(LAST_UPDATED DESC);

CREATE INDEX IX_PR_PATHCOURSE ON DBO.PREREQUISITES(PATH_ID, COURSE_ID);

CREATE INDEX IX_PR_GLOBAL ON DBO.PREREQUISITES(COURSE_ID) WHERE PATH_ID IS NULL;

GO

-- ============================================

INSERT DBO.LEARNINGPATHS (
    TITLE,
    SLUG,
    DESCRIPTION,
    CATEGORY,
    DIFFICULTY,
    ESTIMATED_HOURS,
    IS_PUBLISHED,
    OWNER_ID
) VALUES (
    N'Full-Stack Web Dev',
    'full-stack-web-dev',
    N'Lộ trình từ JS đến deployment',
    'Web Development',
    'Intermediate',
    120,
    1,
    2
);

DECLARE
    @PATHID INT = SCOPE_IDENTITY();
    INSERT DBO.PATHCOURSES (PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE) VALUES (@PATHID, 1, 1, NULL, 0), (@PATHID, 2, 2, 70, 1), (@PATHID, 5, 3, 75, 1);
    INSERT DBO.PREREQUISITES (PATH_ID, COURSE_ID, PREREQUISITE_COURSE_ID, MIN_SCORE_REQUIRED) VALUES (@PATHID, 2, 1, 60), (@PATHID, 5, 2, 70);
 
    -- =============================================
    -- smart-lms-backend/scripts/seed-learning-paths.sql
    USE    SMART_LMS;
    GO    
 -- Xóa dữ liệu cũ (nếu có)
    DELETE FROM PATHPROGRESS;
    DELETE FROM PATHENROLLMENTS;
    DELETE FROM PATHCOURSES;
    DELETE FROM PREREQUISITES;
    DELETE FROM LEARNINGPATHS;
    GO    
 -- Reset identity
    DBCC CHECKIDENT('LearningPaths', RESEED, 0);
    DBCC   CHECKIDENT('PathCourses', RESEED, 0);
    DBCC   CHECKIDENT('PathEnrollments', RESEED, 0);
    DBCC   CHECKIDENT('PathProgress', RESEED, 0);
    GO    
 -- 1. INSERT Learning Paths
    INSERT INTO LEARNINGPATHS (
        TITLE,
        SLUG,
        DESCRIPTION,
        CATEGORY,
        DIFFICULTY,
        ESTIMATED_HOURS,
        IS_PUBLISHED,
        OWNER_ID
    ) VALUES (
        N'Full-Stack Web Development Bootcamp',
        'full-stack-web-development-bootcamp',
        N'Lộ trình hoàn chỉnh từ Frontend React đến Backend Node.js, database và deployment. Phù hợp cho người mới bắt đầu muốn trở thành Full-Stack Developer.',
        'Web Development',
        'Intermediate',
        180,
        1,
        2 -- instructor1
    ), (
        N'Data Science với Python',
        'data-science-python',
        N'Nền tảng Data Science với Python, Pandas, NumPy và Machine Learning. Từ cơ bản đến nâng cao với các project thực tế.',
        'Data Science',
        'Beginner',
        220,
        1,
        3 -- instructor2
    ), (
        N'AI & Machine Learning Advanced',
        'ai-machine-learning-advanced',
        N'Khóa học nâng cao về AI và Machine Learning với TensorFlow, Deep Learning, và Neural Networks. Yêu cầu có kiến thức Python.',
        'AI/ML',
        'Advanced',
        350,
        1,
        4 -- instructor3
    ), (
        N'Mobile App Development với React Native',
        'mobile-app-react-native',
        N'Phát triển ứng dụng di động đa nền tảng với React Native. Từ cơ bản đến publish app lên store.',
        'Mobile Development',
        'Intermediate',
        150,
        1,
        2 -- instructor1
    ), (
        N'DevOps & Cloud Computing',
        'devops-cloud-computing',
        N'Triển khai và quản lý ứng dụng trên cloud với Docker, Kubernetes, AWS. Tự động hóa CI/CD pipeline.',
        'DevOps',
        'Advanced',
        280,
        1,
        3 -- instructor2
    ), (
        N'JavaScript Fundamentals',
        'javascript-fundamentals',
        N'Nền tảng JavaScript từ cơ bản đến nâng cao. ES6+, async/await, DOM manipulation và modern JavaScript.',
        'Programming',
        'Beginner',
        120,
        1,
        4 -- instructor3
    ), (
        N'Backend API với Node.js Express',
        'backend-api-nodejs-express',
        N'Xây dựng RESTful API với Node.js, Express, authentication, database integration và best practices.',
        'Backend Development',
        'Intermediate',
        160,
        0, -- Draft
        2 -- instructor1
    );
    GO    
 -- 2. INSERT PathCourses (liên kết courses với learning paths)
    -- Path 1: Full-Stack Web Development (courses 1,2,3,4,5,6)
    INSERT INTO PATHCOURSES (
        PATH_ID,
        COURSE_ID,
        POSITION,
        MIN_SCORE_REQUIRED,
        REQUIRE_QUIZ_COMPLETE
    ) VALUES (
        1,
        1,
        1,
        NULL,
        0
    ), -- HTML/CSS Basics
    (
        1,
        2,
        2,
        70,
        1
    ), -- JavaScript Fundamentals
    (
        1,
        3,
        3,
        75,
        1
    ), -- React.js
    (
        1,
        4,
        4,
        70,
        1
    ), -- Node.js Backend
    (
        1,
        5,
        5,
        75,
        1
    ), -- Database Design
    (
        1,
        6,
        6,
        80,
        1
    );
 
    -- Deployment
    -- Path 2: Data Science với Python (courses 7,8,9,10)
    INSERT INTO PATHCOURSES ( PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE ) VALUES ( 2, 7, 1, NULL, 0 ), -- Python Basics
    ( 2, 8, 2, 70, 1 ), -- Pandas & NumPy
    ( 2, 9, 3, 75, 1 ), -- Data Visualization
    ( 2, 10, 4, 80, 1 );
 
    -- Machine Learning
    -- Path 3: AI & ML Advanced (courses 10,11,12,13)
    INSERT INTO PATHCOURSES ( PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE ) VALUES ( 3, 10, 1, 80, 1 ), -- ML Prerequisites
    ( 3, 11, 2, 85, 1 ), -- Deep Learning
    ( 3, 12, 3, 85, 1 ), -- Neural Networks
    ( 3, 13, 4, 90, 1 );
 
    -- Advanced AI
    -- Path 4: Mobile App Development (courses 3,14,15,16)
    INSERT INTO PATHCOURSES ( PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE ) VALUES ( 4, 3, 1, 70, 1 ), -- React.js foundation
    ( 4, 14, 2, 75, 1 ), -- React Native Basics
    ( 4, 15, 3, 80, 1 ), -- Mobile UI/UX
    ( 4, 16, 4, 80, 1 );
 
    -- App Store Deployment
    -- Path 5: DevOps & Cloud (courses 17,18,19,20)
    INSERT INTO PATHCOURSES ( PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE ) VALUES ( 5, 17, 1, NULL, 0 ), -- Linux Basics
    ( 5, 18, 2, 75, 1 ), -- Docker
    ( 5, 19, 3, 80, 1 ), -- Kubernetes
    ( 5, 20, 4, 85, 1 );
 
    -- AWS Cloud
    -- Path 6: JavaScript Fundamentals (courses 2,21,22)
    INSERT INTO PATHCOURSES ( PATH_ID, COURSE_ID, POSITION, MIN_SCORE_REQUIRED, REQUIRE_QUIZ_COMPLETE ) VALUES ( 6, 2, 1, NULL, 0 ), -- JS Basics
    ( 6, 21, 2, 70, 1 ), -- ES6+ Features
    ( 6, 22, 3, 75, 1 );
 
    -- Advanced JS Concepts
    GO    
 -- 3. INSERT Prerequisites (điều kiện tiên quyết)
    INSERT INTO PREREQUISITES (
        PATH_ID,
        COURSE_ID,
        PREREQUISITE_COURSE_ID,
        MIN_SCORE_REQUIRED
    ) VALUES
 -- Full-Stack Path: React cần JS, Node cần JS, Database cần Backend knowledge
    (
        1,
        3,
        2,
        70
    ), -- React cần JavaScript
    (
        1,
        4,
        2,
        70
    ), -- Node.js cần JavaScript
    (
        1,
        5,
        4,
        75
    ), -- Database cần Node.js
    (
        1,
        6,
        5,
        80
    ), -- Deployment cần Database
    -- Data Science Path: ML cần Python + Data Analysis
    (
        2,
        9,
        8,
        75
    ), -- Data Viz cần Pandas
    (
        2,
        10,
        9,
        80
    ), -- ML cần Data Viz
    -- AI/ML Path: Advanced courses cần foundation
    (
        3,
        11,
        10,
        80
    ), -- Deep Learning cần ML
    (
        3,
        12,
        11,
        85
    ), -- Neural Networks cần Deep Learning
    (
        3,
        13,
        12,
        90
    ), -- Advanced AI cần Neural Networks
    -- Mobile Path: React Native cần React
    (
        4,
        14,
        3,
        75
    ), -- React Native cần React
    (
        4,
        15,
        14,
        80
    ), -- Mobile UI cần React Native
    (
        4,
        16,
        15,
        85
    ), -- Deployment cần UI
    -- DevOps Path: Sequential requirements
    (
        5,
        18,
        17,
        70
    ), -- Docker cần Linux
    (
        5,
        19,
        18,
        80
    ), -- Kubernetes cần Docker
    (
        5,
        20,
        19,
        85
    );
 
    -- AWS cần Kubernetes
    GO    
 -- 4. INSERT sample enrollments (students enrolled in paths)
    INSERT INTO PATHENROLLMENTS (
        PATH_ID,
        USER_ID,
        STATUS,
        ENROLLED_AT
    ) VALUES (
        1,
        5,
        'active',
        DATEADD(DAY, -30, GETDATE())
    ), -- student01 in Full-Stack
    (
        1,
        6,
        'active',
        DATEADD(DAY, -25, GETDATE())
    ), -- student02 in Full-Stack
    (
        1,
        7,
        'completed',
        DATEADD(DAY, -60, GETDATE())
    ), -- student03 completed
    (
        2,
        5,
        'active',
        DATEADD(DAY, -20, GETDATE())
    ), -- student01 in Data Science
    (
        2,
        8,
        'active',
        DATEADD(DAY, -15, GETDATE())
    ), -- student04 in Data Science
    (
        3,
        9,
        'active',
        DATEADD(DAY, -10, GETDATE())
    ), -- student05 in AI/ML
    (
        4,
        10,
        'active',
        DATEADD(DAY, -5, GETDATE())
    ), -- student06 in Mobile
    (
        5,
        11,
        'paused',
        DATEADD(DAY, -40, GETDATE())
    );
 
    -- student07 in DevOps (paused)
    GO    
 -- 5. INSERT sample progress
    INSERT INTO PATHPROGRESS (
        PATH_ID,
        USER_ID,
        COURSE_ID,
        PROGRESS,
        SCORE,
        TIME_SPENT_MINUTES,
        COMPLETED
    ) VALUES
 -- student01 progress in Full-Stack path
    (
        1,
        5,
        1,
        100,
        85,
        1200,
        1
    ), -- Completed HTML/CSS
    (
        1,
        5,
        2,
        65,
        72,
        800,
        0
    ), -- In progress JavaScript
    -- student02 progress in Full-Stack path
    (
        1,
        6,
        1,
        100,
        92,
        1000,
        1
    ), -- Completed HTML/CSS
    (
        1,
        6,
        2,
        100,
        88,
        1400,
        1
    ), -- Completed JavaScript
    (
        1,
        6,
        3,
        30,
        NULL,
        400,
        0
    ), -- Starting React
    -- student03 completed Full-Stack (all courses)
    (
        1,
        7,
        1,
        100,
        95,
        1100,
        1
    ), (
        1,
        7,
        2,
        100,
        90,
        1300,
        1
    ), (
        1,
        7,
        3,
        100,
        87,
        1600,
        1
    ), (
        1,
        7,
        4,
        100,
        85,
        1400,
        1
    ), (
        1,
        7,
        5,
        100,
        92,
        1200,
        1
    ), (
        1,
        7,
        6,
        100,
        89,
        1000,
        1
    ),
 -- student01 progress in Data Science path
    (
        2,
        5,
        7,
        80,
        78,
        900,
        0
    ), -- Python in progress
    -- student04 progress in Data Science path
    (
        2,
        8,
        7,
        100,
        85,
        1200,
        1
    ), -- Completed Python
    (
        2,
        8,
        8,
        45,
        NULL,
        600,
        0
    ), -- Pandas in progress
    -- student05 progress in AI/ML path
    (
        3,
        9,
        10,
        20,
        NULL,
        300,
        0
    ), -- Starting ML
    -- student06 progress in Mobile path
    (
        4,
        10,
        3,
        75,
        80,
        1000,
        0
    );
 
    -- React in progress
    GO     PRINT 'Learning Paths data seeded successfully!';
    PRINT  'Summary:';
    PRINT  '- 7 Learning Paths created';
    PRINT  '- Path-Course mappings created';
    PRINT  '- Prerequisites defined';
    PRINT  '- 8 Student enrollments added';
    PRINT  '- Sample progress data inserted';
 
    -- Verify data
    SELECT LP.TITLE, LP.CATEGORY, LP.DIFFICULTY, LP.ESTIMATED_HOURS, LP.IS_PUBLISHED, U.FULL_NAME AS INSTRUCTOR, (
        SELECT
            COUNT(*)
        FROM
            PATHCOURSES PC
        WHERE
            PC.PATH_ID = LP.ID
    ) AS COURSES_COUNT, (
        SELECT
            COUNT(*)
        FROM
            PATHENROLLMENTS PE
        WHERE
            PE.PATH_ID = LP.ID
    ) AS ENROLLED_COUNT FROM LEARNINGPATHS LP JOIN USERS U ON LP.OWNER_ID = U.ID ORDER BY LP.CREATED_AT DESC;
 
    -- Chạy câu lệnh này trên database smart_lms của bạn
    ALTER  TABLE DBO.USERS ADD SKILL_LEVEL NVARCHAR( 30 ) NULL CHECK ( SKILL_LEVEL IN ('Beginner', 'Intermediate', 'Advanced') ), CAREER_GOAL NVARCHAR( 100 ) NULL;
    GO    
 -- (Tùy chọn) Cập nhật dữ liệu mẫu cho một vài user để kiểm thử
    UPDATE DBO.USERS SET SKILL_LEVEL = 'Beginner', CAREER_GOAL = 'Web Development' WHERE ID = 5;
 
    -- student01
    UPDATE DBO.USERS SET SKILL_LEVEL = 'Intermediate', CAREER_GOAL = 'AI/ML' WHERE ID = 6;
 
    -- student02
    GO