CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_num VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(10) CHECK (user_type IN ('candidate', 'employer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (LENGTH(password_hash) >= 8)
);

CREATE TABLE candidates (
    candidate_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    phone VARCHAR(15),
    telegram_id VARCHAR(50),
    education VARCHAR(50),
    experience TEXT,
    portfolio_links TEXT[],
    project_description TEXT[]
);

CREATE TABLE employers (
    employer_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    legal_address TEXT,
    project_photo BYTEA,
    company_logo BYTEA,
    project_description TEXT[]
);

CREATE TABLE vacancies (
    vacancy_id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(employer_id) ON DELETE CASCADE,
    title VARCHAR(100),
    description TEXT,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    currency VARCHAR(10),
    employment_type VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(50) UNIQUE
);

CREATE TABLE candidate_skills (
    candidate_id INT REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE vacancy_skills (
    vacancy_id INT REFERENCES vacancies(vacancy_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (vacancy_id, skill_id)
);

CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    vacancy_id INT REFERENCES vacancies(vacancy_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    resume_id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    title VARCHAR(100),
    description TEXT,
    expected_salary DECIMAL(10, 2),
    currency VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_applications (
    application_id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(employer_id) ON DELETE CASCADE,
    resume_id INT REFERENCES resumes(resume_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Добавляем пользователей
INSERT INTO users (first_name, last_name, email, phone_num, password_hash, user_type) VALUES
('John', 'Doe', 'johndoe@example.com', '123-456-7890', 'hashed_password_1', 'candidate'),
('Jane', 'Smith', 'janesmith@example.com', '987-654-3210', 'hashed_password_2', 'employer'),
('Mike', 'Brown', 'mikebrown@example.com', '555-123-4567', 'hashed_password_3', 'candidate'),
('Lisa', 'Taylor', 'lisataylor@example.com', '555-987-6543', 'hashed_password_4', 'employer'),
('Emily', 'Johnson', 'emilyj@example.com', '555-234-5678', 'hashed_password_5', 'candidate');

-- Добавляем кандидатов
INSERT INTO candidates (user_id, phone, telegram_id, education, experience, portfolio_links, project_description) VALUES
(1, '123-456-7890', '@johndoe', 'Bachelor of Science in Computer Science', '3 years in software development', ARRAY['https://github.com/johndoe', 'https://johndoeportfolio.com'], ARRAY['Project 1 description', 'Project 2 description']),
(3, '555-123-4567', '@mikebrown', 'Master of Data Science', '2 years in data analysis', ARRAY['https://github.com/mikebrown', 'https://mikebrownportfolio.com'], ARRAY['Data Analysis Project', 'ML Project']),
(5, '555-234-5678', '@emilyj', 'Bachelor of Engineering', '4 years in hardware engineering', ARRAY['https://github.com/emilyj', 'https://emilyjportfolio.com'], ARRAY['Hardware Project 1', 'Embedded Systems']);

-- Добавляем работодателей
INSERT INTO employers (user_id, company_name, description, website, legal_address, project_photo, company_logo, project_description) VALUES
(2, 'Tech Solutions Inc.', 'A leading tech company.', 'https://techsolutions.com', '123 Tech Street', NULL, NULL, ARRAY['Tech Project 1', 'Tech Project 2']),
(4, 'Green Energy Corp.', 'Renewable energy solutions.', 'https://greenenergy.com', '456 Green Ave', NULL, NULL, ARRAY['Solar Panel Project', 'Wind Energy Project']);

-- Добавляем вакансии
INSERT INTO vacancies (employer_id, title, description, salary_min, salary_max, currency, employment_type, location) VALUES
(1, 'Software Developer', 'Develop and maintain software applications.', 50000, 70000, 'USD', 'Full-time', 'New York'),
(1, 'Data Analyst', 'Analyze data and create reports.', 45000, 60000, 'USD', 'Part-time', 'San Francisco'),
(2, 'Electrical Engineer', 'Design and implement electrical systems.', 55000, 75000, 'USD', 'Full-time', 'Austin'),
(2, 'Mechanical Engineer', 'Work on mechanical systems and devices.', 52000, 72000, 'USD', 'Full-time', 'Dallas');

-- Добавляем навыки
INSERT INTO skills (skill_name) VALUES
('Python'),
('JavaScript'),
('Data Analysis'),
('Project Management'),
('Electrical Engineering'),
('Mechanical Engineering'),
('Machine Learning');

-- Добавляем навыки кандидатов
INSERT INTO candidate_skills (candidate_id, skill_id) VALUES
(1, 1), -- Python
(1, 2), -- JavaScript
(3, 3), -- Data Analysis
(3, 7), -- Machine Learning
(5, 5), -- Electrical Engineering
(5, 6); -- Mechanical Engineering

-- Добавляем навыки вакансий
INSERT INTO vacancy_skills (vacancy_id, skill_id) VALUES
(1, 1), -- Python
(1, 2), -- JavaScript
(2, 3), -- Data Analysis
(3, 5), -- Electrical Engineering
(4, 6); -- Mechanical Engineering

-- Добавляем заявки на вакансии
INSERT INTO applications (candidate_id, vacancy_id, status) VALUES
(1, 1, 'pending'),
(1, 2, 'accepted'),
(3, 2, 'rejected'),
(3, 3, 'pending'),
(5, 4, 'pending');

-- Добавляем резюме
INSERT INTO resumes (candidate_id, title, description, expected_salary, currency) VALUES
(1, 'Software Developer Resume', 'Experienced in full-stack development.', 65000, 'USD'),
(3, 'Data Analyst Resume', 'Skilled in data science and analytics.', 60000, 'USD'),
(5, 'Electrical Engineer Resume', 'Expert in electrical and mechanical systems.', 70000, 'USD');

-- Добавляем отклики на резюме
INSERT INTO resume_applications (employer_id, resume_id, status) VALUES
(1, 1, 'pending'),
(2, 2, 'accepted'),
(2, 3, 'rejected');
