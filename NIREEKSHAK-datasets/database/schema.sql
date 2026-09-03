-- =====================================================
-- TRUSTUS DATABASE
-- MPLADS DATA FOUNDATION
-- MEMBER 1
-- =====================================================


-- =====================================================
-- STATES
-- =====================================================

CREATE TABLE IF NOT EXISTS states (

    state_id SERIAL PRIMARY KEY,

    state_name VARCHAR(150) NOT NULL UNIQUE

);


-- =====================================================
-- CONSTITUENCIES
-- =====================================================

CREATE TABLE IF NOT EXISTS constituencies (

    constituency_id SERIAL PRIMARY KEY,

    state_id INTEGER NOT NULL,

    constituency_name VARCHAR(200) NOT NULL,

    CONSTRAINT fk_constituency_state

        FOREIGN KEY (state_id)

        REFERENCES states(state_id),

    CONSTRAINT unique_constituency

        UNIQUE (state_id, constituency_name)

);


-- =====================================================
-- MPs
-- =====================================================

CREATE TABLE IF NOT EXISTS mps (

    mp_id SERIAL PRIMARY KEY,

    mp_name VARCHAR(250) NOT NULL,

    house VARCHAR(50),

    constituency_id INTEGER,

    CONSTRAINT fk_mp_constituency

        FOREIGN KEY (constituency_id)

        REFERENCES constituencies(constituency_id)

);


-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (

    project_id VARCHAR(50) PRIMARY KEY,

    mp_id INTEGER,

    constituency_id INTEGER,

    state_id INTEGER,

    work_description TEXT,

    category VARCHAR(250),

    city VARCHAR(250),

    ward VARCHAR(250),

    block VARCHAR(250),

    village VARCHAR(250),

    recommended_amount NUMERIC(15,2),

    allocated_amount NUMERIC(15,2),

    expenditure_amount NUMERIC(15,2),

    recommendation_date DATE,

    approval_date DATE,

    start_date DATE,

    completion_date DATE,

    project_status VARCHAR(150),

    approval_status VARCHAR(150),

    source_row_number INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_project_mp

        FOREIGN KEY (mp_id)

        REFERENCES mps(mp_id),


    CONSTRAINT fk_project_constituency

        FOREIGN KEY (constituency_id)

        REFERENCES constituencies(constituency_id),


    CONSTRAINT fk_project_state

        FOREIGN KEY (state_id)

        REFERENCES states(state_id)

);


-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_state
ON projects(state_id);


CREATE INDEX IF NOT EXISTS idx_projects_constituency
ON projects(constituency_id);


CREATE INDEX IF NOT EXISTS idx_projects_mp
ON projects(mp_id);


CREATE INDEX IF NOT EXISTS idx_projects_category
ON projects(category);


CREATE INDEX IF NOT EXISTS idx_projects_status
ON projects(project_status);


CREATE INDEX IF NOT EXISTS idx_projects_amount
ON projects(allocated_amount);


-- =====================================================
-- COMPLETED
-- =====================================================

SELECT 'TrustUs schema created successfully' AS message;