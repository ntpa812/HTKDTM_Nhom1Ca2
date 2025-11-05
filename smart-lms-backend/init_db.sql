DROP TABLE IF EXISTS Enrollments, Courses, Users;

CREATE DATABASE IF NOT EXISTS railway;
USE railway;

-- 1️⃣ USERS
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2️⃣ COURSES
DROP TABLE IF EXISTS Courses;
CREATE TABLE Courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES Users(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3️⃣ ENROLLMENTS
DROP TABLE IF EXISTS Enrollments;
CREATE TABLE Enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  progress DECIMAL(5,2) DEFAULT 0,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (course_id) REFERENCES Courses(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4️⃣ SEED DATA
INSERT INTO Users (full_name, email, password, role) VALUES
('Nguyen Van A', 'a@example.com', '123456', 'instructor'),
('Tran Thi B', 'b@example.com', 'abcdef', 'instructor'),
('Le Thi C', 'c@example.com', '123123', 'student'),
('Pham Van D', 'd@example.com', '654321', 'student');

INSERT INTO Courses (title, description, instructor_id) VALUES
('Python cơ bản', 'Học lập trình Python từ đầu cho người mới', 1),
('Node.js nâng cao', 'Xây dựng REST API với Express và MySQL', 2),
('Phân tích dữ liệu', 'Khai phá dữ liệu với Python và Pandas', 1);

INSERT INTO Enrollments (user_id, course_id, progress) VALUES
(3, 1, 70.5),
(4, 2, 45.0),
(4, 3, 20.0);

-- ✅ KIỂM TRA
SELECT * FROM Users;
SELECT * FROM Courses;
SELECT * FROM Enrollments;
