USE nsi_it_lms;

CREATE TABLE lecture_notes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    lecture_id INT UNSIGNED NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_url VARCHAR(1000) NOT NULL,

    file_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',

    file_size BIGINT UNSIGNED NULL,

    storage_provider ENUM(
        'GOOGLE_DRIVE',
        'S3'
    ) NOT NULL DEFAULT 'GOOGLE_DRIVE',

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    display_order INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    created_by INT UNSIGNED NULL,

    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_lecture_notes_lecture
        FOREIGN KEY (lecture_id)
        REFERENCES lectures(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_lecture_notes_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_lecture_notes_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_lecture_notes_lecture_id (lecture_id),

    INDEX idx_lecture_notes_status (status),

    INDEX idx_lecture_notes_order (lecture_id, display_order)
);