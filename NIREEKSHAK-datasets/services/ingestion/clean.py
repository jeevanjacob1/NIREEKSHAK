import pandas as pd
from pathlib import Path
import re


# ==================================================
# PATHS
# ==================================================

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

EXCEL_FILE = RAW_DIR / "mplads_raw.xlsx"
CSV_FILE = RAW_DIR / "mplads_raw.csv"

OUTPUT_FILE = PROCESSED_DIR / "mplads_clean.csv"


# ==================================================
# LOAD DATA
# ==================================================

if EXCEL_FILE.exists():

    print("Loading Excel file...")
    df = pd.read_excel(EXCEL_FILE)

elif CSV_FILE.exists():

    print("Loading CSV file...")
    df = pd.read_csv(CSV_FILE)

else:

    raise FileNotFoundError(
        "mplads_raw.xlsx or mplads_raw.csv not found "
        "inside data/raw/"
    )
# ==================================================
# REMOVE UNNAMED / EMPTY COLUMNS
# ==================================================

df = df.loc[:, ~df.columns.astype(str).str.startswith("Unnamed:")]

print("Original rows:", len(df))


# ==================================================
# CLEAN COLUMN NAMES
# ==================================================

def clean_column_name(column):

    column = str(column)

    column = column.strip()

    column = re.sub(r"\s+", "_", column)

    column = re.sub(r"[^A-Za-z0-9_]", "", column)

    return column.lower()


original_columns = list(df.columns)

df.columns = [
    clean_column_name(column)
    for column in df.columns
]


# ==================================================
# CLEAN TEXT VALUES
# ==================================================

for column in df.columns:

    if df[column].dtype == "object":

        df[column] = (
            df[column]
            .astype("string")
            .str.strip()
        )


# ==================================================
# STANDARDIZE COMMON EMPTY VALUES
# ==================================================

empty_values = [
    "",
    "NA",
    "N/A",
    "n/a",
    "NULL",
    "null",
    "-",
    "--"
]

for column in df.columns:

    if df[column].dtype == "object" or str(df[column].dtype) == "string":

        df[column] = df[column].replace(
            empty_values,
            pd.NA
        )


# ==================================================
# CREATE INTERNAL TRUSTUS PROJECT ID
# ==================================================

df.insert(
    0,
    "trustus_project_id",
    [
        f"MPLADS-{i:06d}"
        for i in range(1, len(df) + 1)
    ]
)


# ==================================================
# STORE ORIGINAL SOURCE ROW
# ==================================================

# Excel/CSV data normally starts after the header.
# Therefore source row is index + 2.

df["source_row_number"] = df.index + 2


# ==================================================
# AMOUNT CLEANING FUNCTION
# ==================================================

def clean_amount(value):

    if pd.isna(value):
        return None

    value = str(value)

    # Remove currency symbols and commas
    value = value.replace(",", "")
    value = value.replace("₹", "")
    value = value.strip()

    try:
        return float(value)

    except ValueError:
        return None


# ==================================================
# FIND AMOUNT COLUMNS
# ==================================================

for column in df.columns:

    column_lower = column.lower()

    if (
        "amount" in column_lower
        or "allocat" in column_lower
        or "recommend" in column_lower
        or "expend" in column_lower
    ):

        print("Possible amount column:", column)

        df[column] = df[column].apply(clean_amount)


# ==================================================
# REMOVE COMPLETELY EMPTY ROWS
# ==================================================

before = len(df)

df = df.dropna(
    how="all"
)

after = len(df)

print(
    "Completely empty rows removed:",
    before - after
)


# ==================================================
# SAVE CLEAN DATA
# ==================================================

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ==================================================
# REPORT
# ==================================================

print("\n========================================")
print("CLEANING COMPLETE")
print("========================================")

print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\nOutput:")
print(OUTPUT_FILE)

print("\nColumns after cleaning:")

for column in df.columns:
    print("-", column)