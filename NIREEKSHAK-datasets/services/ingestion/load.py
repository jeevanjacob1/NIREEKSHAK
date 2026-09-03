import pandas as pd
import psycopg2
from pathlib import Path
import os
from dotenv import load_dotenv


# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()


# =====================================================
# DATABASE SETTINGS
# =====================================================

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "trustus")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")


# =====================================================
# DATA FILE
# =====================================================

DATA_FILE = Path(
    "data/processed/mplads_clean.csv"
)


# =====================================================
# COLUMN HELPER
# =====================================================

def find_column(df, possible_names):

    for name in possible_names:

        if name in df.columns:
            return name

    return None


# =====================================================
# CHECK FILE
# =====================================================

if not DATA_FILE.exists():

    raise FileNotFoundError(
        f"Could not find {DATA_FILE}"
    )


# =====================================================
# LOAD CSV
# =====================================================

print("Loading cleaned dataset...")

df = pd.read_csv(
    DATA_FILE
)

print("Rows:", len(df))


# =====================================================
# DATABASE CONNECTION
# =====================================================

print("Connecting to PostgreSQL...")

connection = psycopg2.connect(

    host=DB_HOST,

    port=DB_PORT,

    database=DB_NAME,

    user=DB_USER,

    password=DB_PASSWORD
)

cursor = connection.cursor()


# =====================================================
# COLUMN MAPPING
# =====================================================

state_col = find_column(
    df,
    ["state"]
)

mp_col = find_column(
    df,
    ["mp_name"]
)

category_col = find_column(
    df,
    ["category"]
)

constituency_col = find_column(
    df,
    [
        "constituida",
        "constituency",
        "constituency_name"
    ]
)

work_col = find_column(
    df,
    [
        "work",
        "work_description"
    ]
)

city_col = find_column(
    df,
    ["city"]
)

ward_col = find_column(
    df,
    ["ward"]
)

block_col = find_column(
    df,
    ["block"]
)

village_col = find_column(
    df,
    ["village"]
)

house_col = find_column(
    df,
    ["house"]
)

status_col = find_column(
    df,
    [
        "status",
        "project_status"
    ]
)

recommended_col = find_column(
    df,
    [
        "recommended_amount",
        "recommendation_amount"
    ]
)

allocated_col = find_column(
    df,
    [
        "allocated_amount",
        "allocation_amount"
    ]
)


# =====================================================
# PRINT MAPPING
# =====================================================

print("\nColumn mapping:")

print("State:", state_col)
print("MP:", mp_col)
print("Constituency:", constituency_col)
print("Work:", work_col)
print("Category:", category_col)
print("City:", city_col)
print("Ward:", ward_col)
print("Block:", block_col)
print("Village:", village_col)
print("House:", house_col)
print("Status:", status_col)
print("Recommended:", recommended_col)
print("Allocated:", allocated_col)


# =====================================================
# INSERT DATA
# =====================================================

for index, row in df.iterrows():

    # -----------------------------------------------
    # GET VALUES
    # -----------------------------------------------

    state_name = (
        row[state_col]
        if state_col
        and pd.notna(row[state_col])
        else None
    )

    mp_name = (
        row[mp_col]
        if mp_col
        and pd.notna(row[mp_col])
        else None
    )

    constituency_name = (
        row[constituency_col]
        if constituency_col
        and pd.notna(row[constituency_col])
        else None
    )

    category = (
        row[category_col]
        if category_col
        and pd.notna(row[category_col])
        else None
    )

    work_description = (
        row[work_col]
        if work_col
        and pd.notna(row[work_col])
        else None
    )

    city = (
        row[city_col]
        if city_col
        and pd.notna(row[city_col])
        else None
    )

    ward = (
        row[ward_col]
        if ward_col
        and pd.notna(row[ward_col])
        else None
    )

    block = (
        row[block_col]
        if block_col
        and pd.notna(row[block_col])
        else None
    )

    village = (
        row[village_col]
        if village_col
        and pd.notna(row[village_col])
        else None
    )

    house = (
        row[house_col]
        if house_col
        and pd.notna(row[house_col])
        else None
    )

    status = (
        row[status_col]
        if status_col
        and pd.notna(row[status_col])
        else None
    )

    recommended_amount = (
        row[recommended_col]
        if recommended_col
        and pd.notna(row[recommended_col])
        else None
    )

    allocated_amount = (
        row[allocated_col]
        if allocated_col
        and pd.notna(row[allocated_col])
        else None
    )


    # -----------------------------------------------
    # STATE
    # -----------------------------------------------

    state_id = None

    if state_name:

        cursor.execute(
            """
            INSERT INTO states (state_name)

            VALUES (%s)

            ON CONFLICT (state_name)

            DO UPDATE SET
                state_name = EXCLUDED.state_name

            RETURNING state_id;
            """,
            (str(state_name),)
        )

        result = cursor.fetchone()

        if result:

            state_id = result[0]


    # -----------------------------------------------
    # CONSTITUENCY
    # -----------------------------------------------

    constituency_id = None

    if constituency_name and state_id:

        cursor.execute(
            """
            INSERT INTO constituencies
                (state_id, constituency_name)

            VALUES (%s, %s)

            ON CONFLICT
                (state_id, constituency_name)

            DO UPDATE SET
                constituency_name =
                    EXCLUDED.constituency_name

            RETURNING constituency_id;
            """,
            (
                state_id,
                str(constituency_name)
            )
        )

        result = cursor.fetchone()

        if result:

            constituency_id = result[0]


    # -----------------------------------------------
    # MP
    # -----------------------------------------------

    mp_id = None

    if mp_name:

        cursor.execute(
            """
            INSERT INTO mps
                (
                    mp_name,
                    house,
                    constituency_id
                )

            VALUES (%s, %s, %s)

            RETURNING mp_id;
            """,
            (
                str(mp_name),
                str(house) if house else None,
                constituency_id
            )
        )

        result = cursor.fetchone()

        if result:

            mp_id = result[0]


    # -----------------------------------------------
    # PROJECT
    # -----------------------------------------------

    project_id = str(
        row["trustus_project_id"]
    )

    source_row = int(
        row["source_row_number"]
    )


    cursor.execute(
        """
        INSERT INTO projects
        (
            project_id,
            mp_id,
            constituency_id,
            state_id,
            work_description,
            category,
            city,
            ward,
            block,
            village,
            recommended_amount,
            allocated_amount,
            project_status,
            approval_status,
            source_row_number
        )

        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            NULL,
            %s
        )

        ON CONFLICT (project_id)

        DO NOTHING;
        """,

        (
            project_id,
            mp_id,
            constituency_id,
            state_id,
            str(work_description)
                if work_description
                else None,

            str(category)
                if category
                else None,

            str(city)
                if city
                else None,

            str(ward)
                if ward
                else None,

            str(block)
                if block
                else None,

            str(village)
                if village
                else None,

            recommended_amount,
            allocated_amount,

            str(status)
                if status
                else None,

            source_row
        )
    )


    # -----------------------------------------------
    # PROGRESS
    # -----------------------------------------------

    if (index + 1) % 500 == 0:

        print(
            f"Processed {index + 1} records..."
        )


# =====================================================
# COMMIT
# =====================================================

connection.commit()


# =====================================================
# CLOSE
# =====================================================

cursor.close()

connection.close()


print("\n========================================")
print("DATABASE LOAD COMPLETE")
print("========================================")

print(
    f"Loaded {len(df)} records."
)