CREATE TABLE courses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    course_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,

    category_id INT UNSIGNED NULL,

    thumbnail_url VARCHAR(500) NULL,

    duration_value INT NULL,

    duration_unit ENUM('DAYS', 'WEEKS', 'MONTHS') NULL,

    status ENUM(
        'DRAFT',
        'ACTIVE',
        'INACTIVE',
        'ARCHIVED'
    ) NOT NULL DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    created_by INT UNSIGNED NULL,

    updated_by INT UNSIGNED NULL,

    CONSTRAINT uq_courses_course_code
        UNIQUE (course_code),

    CONSTRAINT fk_courses_category
        FOREIGN KEY (category_id)
        REFERENCES course_categories(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_courses_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_courses_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_courses_category_id (category_id),
    INDEX idx_courses_status (status)
);