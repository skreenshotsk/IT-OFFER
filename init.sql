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
    portfolio_links TEXT,
    project_description_candidate TEXT
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
    project_description TEXT
);

CREATE TABLE vacancies (
    vacancy_id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(employer_id) ON DELETE CASCADE,
    title VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    schedule VARCHAR(50),
    education VARCHAR(50),
    experience TEXT,
    currency VARCHAR(10),
    employment_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    contact_email VARCHAR(100),
    contact_phone VARCHAR(25),
    contact_person VARCHAR(100),
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
    location VARCHAR(100),
    birth_date VARCHAR(20),
    citizenship VARCHAR(50),
    profession VARCHAR(100),
    salary_max DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_applications (
    application_id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(employer_id) ON DELETE CASCADE,
    resume_id INT REFERENCES resumes(resume_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Очистка данных
TRUNCATE TABLE resume_applications CASCADE;
TRUNCATE TABLE resumes CASCADE;
TRUNCATE TABLE applications CASCADE;
TRUNCATE TABLE vacancy_skills CASCADE;
TRUNCATE TABLE candidate_skills CASCADE;
TRUNCATE TABLE skills CASCADE;
TRUNCATE TABLE vacancies CASCADE;
TRUNCATE TABLE employers CASCADE;
TRUNCATE TABLE candidates CASCADE;
TRUNCATE TABLE users CASCADE;

-- Таблица users
INSERT INTO users (first_name, last_name, email, phone_num, password_hash, user_type)
VALUES
('Иван', 'Иванов', 'ivanov@example.com', '+79161234567', 'hashed_password_1', 'candidate'),
('Мария', 'Смирнова', 'smirnova@example.com', '+79261234567', 'hashed_password_2', 'candidate'),
('Алексей', 'Петров', 'petrov@example.com', '+79361234567', 'hashed_password_3', 'employer'),
('Елена', 'Кузнецова', 'kuznetsova@example.com', '+79461234567', 'hashed_password_4', 'employer');

-- Таблица candidates
INSERT INTO candidates (user_id, phone, telegram_id, education, experience, portfolio_links, project_description_candidate)
VALUES
(1, '+79161234567', '@ivanov', 'Высшее', '5 лет в разработке ПО', 'https://portfolio-ivanov.ru', 'Разработка приложения для анализа данных'),
(2, '+79261234567', '@smirnova', 'Высшее', '3 года в дизайне', 'https://portfolio-smirnova.ru', 'Создание дизайн-проектов для веб-платформ');

-- Таблица employers
INSERT INTO employers (user_id, company_name, description, website, legal_address, project_description)
VALUES
(3, 'ООО "ТехСтар"', 'Компания-разработчик ПО', 'https://techstar.ru', 'г. Москва, ул. Тверская, д. 10', 'Проектирование сложных IT-систем'),
(4, 'ООО "ДизайнПро"', 'Дизайн-студия', 'https://designpro.ru', 'г. Санкт-Петербург, Невский проспект, д. 20', 'Разработка брендинга и визуальной айдентики');

-- Таблица vacancies
INSERT INTO vacancies (employer_id, title, description, salary_min, salary_max, currency, employment_type, location)
VALUES
(1, 'Программист Python', 'Разработка и поддержка приложений', 100000, 150000, 'RUB', 'Полная занятость', 'Москва'),
(2, 'Графический дизайнер', 'Создание графического контента для брендов', 80000, 120000, 'RUB', 'Удаленная работа', 'Санкт-Петербург');

-- Таблица skills
INSERT INTO skills (skill_name)
VALUES
('Python'),
('C++'),
('C'),
('C#'),
('JavaScript'),
('React'),
('Node.js'),
('HTML/CSS'),
('Git'),
('Docker'),
('SQL'),
('Django'),
('FastAPI'),
('Adobe Photoshop'),
('Google Cloud'),
('Machine Learning'),
('Data Analysis'),
('Agile'),
('Scrum'),
('DevOps'),
('Linux'),
('Bash'),
('REST API'),
('GraphQL'),
('Unity'),
('Unreal Engine'),
('UI/UX Design'),
('Swift'),
('Kotlin'),
('Objective-C'),
('Rust'),
('Go'),
('Ruby'),
('Ruby on Rails'),
('Figma');

-- Таблица candidate_skills
INSERT INTO candidate_skills (candidate_id, skill_id)
VALUES
(1, 1), -- Python
(1, 2), -- SQL
(1, 3), -- Django
(2, 5), -- Adobe Photoshop
(2, 6); -- Figma

-- Таблица vacancy_skills
INSERT INTO vacancy_skills (vacancy_id, skill_id)
VALUES
(1, 1), -- Python
(1, 2), -- SQL
(1, 3), -- Django
(2, 5), -- Adobe Photoshop
(2, 6); -- Figma

-- Таблица applications
INSERT INTO applications (candidate_id, vacancy_id, status)
VALUES
(1, 1, 'pending'),
(2, 2, 'approved');

-- Таблица resumes
INSERT INTO resumes (candidate_id, location, birth_date, citizenship, profession, salary_max)
VALUES
(1, 'Москва', '15.05.1995', 'Россия', 'C++ программист', 120000),
(2, 'Казань', '23.07.2005', 'Россия', 'Python программист', 90000);

-- Таблица resume_applications
INSERT INTO resume_applications (employer_id, resume_id, status)
VALUES
(1, 1, 'pending'),
(2, 2, 'approved');

