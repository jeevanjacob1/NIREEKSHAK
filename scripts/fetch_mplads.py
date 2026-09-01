"""
TrustUs MPLADS data acquisition script.

The current TrustUs prototype uses a manually downloaded
official/public MPLADS dataset stored in:

data/raw/mplads_raw.xlsx

This script is intentionally kept as a placeholder until
a stable downloadable source/API is confirmed.

Do not modify the raw dataset automatically unless the
source and download procedure have been verified.
"""

from pathlib import Path


RAW_DIR = Path("data/raw")

print("TrustUs MPLADS data acquisition")
print("--------------------------------")

print(
    "Current raw data location:"
)

print(
    RAW_DIR / "mplads_raw.xlsx"
)

print(
    "\nNo automatic download configured yet."
)

print(
    "Use the verified source dataset and keep the original file unchanged."
)