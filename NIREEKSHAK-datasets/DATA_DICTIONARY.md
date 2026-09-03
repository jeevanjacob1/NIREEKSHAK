# TrustUs Data Dictionary

## projects

| Field | Description |
|---|---|
| project_id | Internal TrustUs identifier |
| mp_id | Reference to the MP |
| constituency_id | Reference to constituency |
| state_id | Reference to state |
| work_description | Description of the MPLADS work |
| category | Project category |
| city | City/location |
| ward | Ward information |
| block | Block information |
| village | Village information |
| recommended_amount | Recommended amount, when available |
| allocated_amount | Allocated amount, when available |
| expenditure_amount | Actual expenditure, when available |
| recommendation_date | Recommendation date, when available |
| approval_date | Approval/sanction date, when available |
| start_date | Project start date, when available |
| completion_date | Project completion date, when available |
| project_status | Current project/work status |
| approval_status | Approval information |
| source_row_number | Original row number in source dataset |
| created_at | Database insertion timestamp |

## mps

| Field | Description |
|---|---|
| mp_id | Internal MP identifier |
| mp_name | MP name |
| house | Lok Sabha/Rajya Sabha information |
| constituency_id | MP constituency |

## constituencies

| Field | Description |
|---|---|
| constituency_id | Internal constituency identifier |
| state_id | State reference |
| constituency_name | Constituency name |

## states

| Field | Description |
|---|---|
| state_id | Internal state identifier |
| state_name | State name |

## Important

Fields such as expenditure and dates are populated only when supported by the original MPLADS source data.

TrustUs must not fabricate missing values.