CREATE TABLE course_students (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    course_id INT UNSIGNED NOT NULL,

    batch_id INT UNSIGNED NULL,

    student_id INT UNSIGNED NOT NULL,

    status ENUM(
        'ENROLLED',
        'INACTIVE',
        'COMPLETED',
        'DROPPED'
    ) NOT NULL DEFAULT 'ENROLLED',

    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    completed_at TIMESTAMP NULL,

    dropped_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    created_by INT UNSIGNED NULL,

    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_course_students_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_students_batch
        FOREIGN KEY (batch_id)
        REFERENCES course_batches(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_students_user
        FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_students_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_course_students_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT uq_course_student_enrollment
        UNIQUE (course_id, batch_id, student_id),

    INDEX idx_course_students_course_id (course_id),
    INDEX idx_course_students_batch_id (batch_id),
    INDEX idx_course_students_student_id (student_id),
    INDEX idx_course_students_status (status)
);