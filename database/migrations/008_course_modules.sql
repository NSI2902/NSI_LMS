CREATE TABLE course_modules (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    course_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NULL,

    display_order INT NOT NULL DEFAULT 0,

    status ENUM(
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED'
    ) NOT NULL DEFAULT 'DRAFT',

    published_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    created_by INT UNSIGNED NULL,

    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_course_modules_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_modules_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_modules_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_course_modules_course_id (course_id),
    INDEX idx_course_modules_order (course_id, display_order),
    INDEX idx_course_modules_status (status)
);