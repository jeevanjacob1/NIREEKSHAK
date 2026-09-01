-- Small development seed data for TrustUs

INSERT INTO states (state_name)
VALUES
    ('Bihar'),
    ('Rajasthan')
ON CONFLICT (state_name)
DO NOTHING;


INSERT INTO constituencies
    (state_id, constituency_name)
SELECT
    state_id,
    'Darbhanga'
FROM states
WHERE state_name = 'Bihar'
ON CONFLICT DO NOTHING;


INSERT INTO constituencies
    (state_id, constituency_name)
SELECT
    state_id,
    'Karauli-Dholpur'
FROM states
WHERE state_name = 'Rajasthan'
ON CONFLICT DO NOTHING;


INSERT INTO projects
(
    project_id,
    work_description,
    category,
    city,
    allocated_amount,
    project_status,
    source_row_number
)
VALUES
(
    'DEMO-000001',
    'NA - Street lights',
    'Normal/Others',
    'Darbhanga',
    487000,
    'Unsanctioned',
    NULL
),
(
    'DEMO-000002',
    'NA - Construction of roads',
    'Normal/Others',
    'Karauli',
    500000,
    'Unsanctioned',
    NULL
)
ON CONFLICT (project_id)
DO NOTHING;