import pandas as pd
from pathlib import Path

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

DATA_DIR = Path("data/raw")

excel_file = DATA_DIR / "mplads_raw.xlsx"
csv_file = DATA_DIR / "mplads_raw.csv"


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

if excel_file.exists():
    print("Loading Excel file...")
    df = pd.read_excel(excel_file)

elif csv_file.exists():
    print("Loading CSV file...")
    df = pd.read_csv(csv_file)

else:
    raise FileNotFoundError(
        "Could not find mplads_raw.xlsx or mplads_raw.csv "
        "inside data/raw/"
    )


# --------------------------------------------------
# BASIC INFORMATION
# --------------------------------------------------

print("\n========================================")
print("DATASET INFORMATION")
print("========================================")

print("Number of rows:", len(df))
print("Number of columns:", len(df.columns))


# --------------------------------------------------
# COLUMN NAMES
# --------------------------------------------------

print("\n========================================")
print("COLUMN NAMES")
print("========================================")

for i, column in enumerate(df.columns, start=1):
    print(f"{i}. {column}")


# --------------------------------------------------
# DATA TYPES
# --------------------------------------------------

print("\n========================================")
print("DATA TYPES")
print("========================================")

print(df.dtypes)


# --------------------------------------------------
# MISSING VALUES
# --------------------------------------------------

print("\n========================================")
print("MISSING VALUES")
print("========================================")

missing = df.isnull().sum()

print(missing)


# --------------------------------------------------
# DUPLICATES
# --------------------------------------------------

print("\n========================================")
print("DUPLICATES")
print("========================================")

print("Duplicate rows:", df.duplicated().sum())


# --------------------------------------------------
# SAMPLE DATA
# --------------------------------------------------

print("\n========================================")
print("FIRST 10 ROWS")
print("========================================")

print(df.head(10).to_string())


# --------------------------------------------------
# UNIQUE VALUES
# --------------------------------------------------

possible_columns = [
    "STATE",
    "MP NAME",
    "CATEGORY",
    "STATUS",
    "HOUSE"
]

for column in possible_columns:

    if column in df.columns:

        print("\n========================================")
        print(f"VALUES IN {column}")
        print("========================================")

        print(df[column].value_counts(dropna=False).head(20))


# --------------------------------------------------
# AMOUNT COLUMN CANDIDATES
# --------------------------------------------------

print("\n========================================")
print("POSSIBLE AMOUNT COLUMNS")
print("========================================")

for column in df.columns:

    name = str(column).lower()

    if any(word in name for word in [
        "amount",
        "allocat",
        "recommend",
        "cost",
        "expend"
    ]):
        print(column)


print("\nInspection completed.")