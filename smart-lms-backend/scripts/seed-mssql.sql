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