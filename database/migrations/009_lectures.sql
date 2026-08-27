CREATE TABLE lectures (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    module_id INT UNSIGNED NOT NULL,

    title VARCHAR(250) NOT NULL,

    description TEXT NULL,

    lecture_type ENUM(
        'RECORDED',
        'LIVE'
    ) NOT NULL,

    status ENUM(
        'DRAFT',
        'SCHEDULED',
        'LIVE',
        'COMPLETED',
        'RECORDING_AVAILABLE',
        'CANCELLED',
        'PUBLISHED'
    ) NOT NULL DEFAULT 'DRAFT',

    display_order INT NOT NULL DEFAULT 0,

    scheduled_at TIMESTAMP NULL,

    duration_minutes INT NULL,

    meet_url VARCHAR(1000) NULL,

    recording_url VARCHAR(1000) NULL,

    recording_provider ENUM(
        'GOOGLE_DRIVE',
        'S3'
    ) NULL,

    recording_status ENUM(
        'NOT_AVAILABLE',
        'AVAILABLE'
    ) NOT NULL DEFAULT 'NOT_AVAILABLE',

    published_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    created_by INT UNSIGNED NULL,

    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_lectures_module
        FOREIGN KEY (module_id)
        REFERENCES course_modules(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_lectures_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_lectures_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_lectures_module_id (module_id),
    INDEX idx_lectures_type (lecture_type),
    INDEX idx_lectures_status (status),
    INDEX idx_lectures_scheduled_at (scheduled_at),
    INDEX idx_lectures_order (module_id, display_order)
);