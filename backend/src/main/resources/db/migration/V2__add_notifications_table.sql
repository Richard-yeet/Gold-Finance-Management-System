CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_entity_type VARCHAR(50),
    reference_entity_id BIGINT,
    reference_url VARCHAR(500),
    created_by VARCHAR(120) NOT NULL DEFAULT 'system',
    updated_by VARCHAR(120) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
