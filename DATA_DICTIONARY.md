# Data Dictionary - LPL Budget Allocation Tool

## Input File (employee_budget_input.xlsx)

### Required Format
- **File Name:** `employee_budget_input.xlsx` (exactly)
- **Location:** `input/` folder
- **Sheet Name:** `Employees` (exactly)
- **Format:** Excel 2007+ (.xlsx)

### Input Columns

#### 1. Employee ID
- **Type:** Text/String
- **Max Length:** 50 characters
- **Uniqueness:** Should be unique per employee
- **Example:** `EMP001`, `E12345`, `ID-5678`
- **Validation:** Required, no blanks allowed
- **Purpose:** Unique identifier for employee

#### 2. Email ID
- **Type:** Text/String
- **Max Length:** 100 characters
- **Format:** Valid email format (not validated by tool)
- **Example:** `john.smith@company.com`
- **Validation:** Required, no blanks allowed
- **Purpose:** Employee email for communication

#### 3. Employee Name
- **Type:** Text/String
- **Max Length:** 100 characters
- **Format:** First and Last name recommended
- **Example:** `John Smith`, `Jane Doe`, `Bob Wilson`
- **Validation:** Required, no blanks allowed
- **Purpose:** Employee identification

#### 4. Meta Business Unit
- **Type:** Text/String
- **Max Length:** 100 characters
- **Format:** Business unit name
- **Example:** `HR`, `Technology`, `Finance`, `Operations`, `Legal`
- **Validation:** Required, no blanks allowed
- **Purpose:** Grouping for BU wallets and separate reports
- **Special:** Each unique value creates a separate output file

#### 5. Employee Level
- **Type:** Numeric (Integer or Float)
- **Range:** Typically 1 to 7
- **Special Values:**
  - `1-6` → Junior level (Fresh: $1,500, Rollover Cap: $300)
  - `6.1` → Exactly 6.1 (Senior level)
  - `7+` → Senior level (Fresh: $4,000, Rollover Cap: $800)
- **Example Values:** `1`, `2`, `3`, `4`, `5`, `6`, `6.1`, `6.5`, `7`
- **Validation:** Required, must be numeric
- **Purpose:** Determines allocation and rollover rules

#### 6. Balance Budget
- **Type:** Numeric (Float or Integer)
- **Range:** 0 to unlimited (typically 0-5000)
- **Decimal Places:** Can be 0 or 2
- **Example Values:** `0`, `150`, `250.50`, `1200`, `500`
- **Validation:** Required, must be numeric, must be ≥ 0
- **Purpose:** Current balance for rollover calculation

---

## Output Files

### Master Output (MASTER_EMPLOYEE_OUTPUT_*.xlsx)

#### File Naming
- **Pattern:** `MASTER_EMPLOYEE_OUTPUT_YYYYMMDD_HHMMSS.xlsx`
- **Example:** `MASTER_EMPLOYEE_OUTPUT_20260608_163240.xlsx`
- **Timestamp:** Execution date and time

#### Columns

##### Column 1: Employee ID
- **Source:** From input
- **Type:** Text
- **Purpose:** Reference
- **Changes:** None

##### Column 2: Email ID
- **Source:** From input
- **Type:** Text
- **Purpose:** Communication
- **Changes:** None

##### Column 3: Employee Name
- **Source:** From input
- **Type:** Text
- **Purpose:** Reference
- **Changes:** None

##### Column 4: Meta Business Unit
- **Source:** From input
- **Type:** Text
- **Purpose:** Grouping
- **Changes:** None

##### Column 5: Employee Level
- **Source:** From input
- **Type:** Numeric
- **Purpose:** Decision logic
- **Changes:** None

##### Column 6: Balance Budget
- **Source:** From input
- **Type:** Currency (2 decimal places)
- **Purpose:** Base for rollover
- **Changes:** Formatted to 2 decimals

##### Column 7: Fresh Allocation
- **Source:** Calculated
- **Type:** Currency (2 decimal places)
- **Formula:**
  ```
  IF Level >= 6.1: $4,000
  ELSE: $1,500
  ```
- **Range:** $1,500 or $4,000
- **Purpose:** New budget for employee

##### Column 8: Rollover Amount
- **Source:** Calculated
- **Type:** Currency (2 decimal places)
- **Formula:**
  ```
  IF Balance = 0: $0
  IF Level < 6.1:
     IF Balance <= 300: Balance
     ELSE: 300
  IF Level >= 6.1:
     IF Balance <= 800: Balance
     ELSE: 800
  ```
- **Range:** $0 to $300 (for level 1-6) or $0 to $800 (for level 6.1+)
- **Purpose:** Amount carried to next quarter

##### Column 9: Remaining BU Wallet Contribution
- **Source:** Calculated
- **Type:** Currency (2 decimal places)
- **Formula:**
  ```
  Remaining = Balance - Rollover
  IF Remaining < 0: 0
  ```
- **Range:** $0 to Balance amount
- **Purpose:** Contribution to Business Unit common wallet

#### Row Order
- Sorted by Meta Business Unit (A-Z)
- Then by Employee ID (A-Z)
- One row per employee

#### Total Rows
- Number of valid employees processed
- Invalid employees excluded
- Count shown in execution log

---

### BU Summary Output (BU_SUMMARY_OUTPUT_*.xlsx)

#### File Naming
- **Pattern:** `BU_SUMMARY_OUTPUT_YYYYMMDD_HHMMSS.xlsx`
- **Example:** `BU_SUMMARY_OUTPUT_20260608_163240.xlsx`
- **Timestamp:** Execution date and time

#### Sheet Name
- **Single Sheet:** `BU Summary`

#### Columns

##### Column 1: Meta Business Unit
- **Source:** From input (unique values)
- **Type:** Text
- **Purpose:** BU identification
- **Note:** One row per unique BU

##### Column 2: Total BU Wallet
- **Source:** Calculated
- **Type:** Currency (2 decimal places)
- **Formula:** `SUM(Remaining BU Wallet Contribution for all employees in BU)`
- **Range:** $0 to sum of all balances
- **Purpose:** Total wallet contribution from BU

##### Column 3: Total Employees in BU
- **Source:** Calculated
- **Type:** Integer
- **Formula:** `COUNT(Employees in BU)`
- **Range:** 1 to N
- **Purpose:** Headcount by BU

##### Column 4: Average Balance Budget
- **Source:** Calculated
- **Type:** Currency (2 decimal places)
- **Formula:** `AVG(Balance Budget for all employees in BU)`
- **Range:** $0 to maximum balance
- **Purpose:** Average remaining balance by BU

#### Row Order
- Sorted by Meta Business Unit (A-Z)
- One row per unique Business Unit

#### Total Rows
- Number of unique Business Units
- Sum of all Total BU Wallet = Total company contribution

---

### Individual BU Output (BU_*.xlsx)

#### File Naming
- **Pattern:** `BU_<BUSINESS_UNIT_NAME>_YYYYMMDD_HHMMSS.xlsx`
- **Example:** `BU_Technology_20260608_163240.xlsx`
- **Note:** BU name sanitized (spaces → underscores)

#### Sheet 1: Employees

##### Columns (Same as Master Output)
1. Employee ID
2. Email ID
3. Employee Name
4. Employee Level
5. Balance Budget
6. Fresh Allocation
7. Rollover Amount
8. Remaining BU Wallet Contribution

##### Row Order
- Sorted by Employee ID (A-Z)
- Only employees from this BU
- One row per employee

##### Total Rows
- Number of employees in this BU

#### Sheet 2: BU_Summary

##### Data Format
- **Metric | Value** (two columns)

##### Metrics
1. **Meta Business Unit**
   - **Value:** Business Unit name (string)

2. **Total Employees**
   - **Value:** Count (integer)

3. **Total BU Wallet**
   - **Value:** Currency (2 decimal places)

---

### Validation Errors Output (VALIDATION_ERRORS_*.txt)

#### File Naming
- **Pattern:** `VALIDATION_ERRORS_YYYYMMDD_HHMMSS.txt`
- **Example:** `VALIDATION_ERRORS_20260608_163240.txt`
- **Created:** Only if errors exist

#### File Format
```
VALIDATION ERRORS REPORT
Generated: 2026-06-08 16:32:26
Total Errors: N
================================================================================

Row 25: EMP045 - Missing field: Employee Level
Row 67: EMP089 - Negative balance: -100
Row 128: EMP156 - Invalid balance value: ABC
```

#### Error Types

##### Error Type 1: Missing Field
- **Pattern:** `Row X: EMPLOYEE_ID - Missing field: COLUMN_NAME`
- **Meaning:** Required column has no value
- **Remediation:** Add missing value to Excel file

##### Error Type 2: Negative Balance
- **Pattern:** `Row X: EMPLOYEE_ID - Negative balance: VALUE`
- **Meaning:** Balance Budget is less than 0
- **Remediation:** Change balance to ≥ 0 or delete row

##### Error Type 3: Invalid Data Type
- **Pattern:** `Row X: EMPLOYEE_ID - Invalid COLUMN_NAME value: VALUE`
- **Meaning:** Column has non-numeric value
- **Remediation:** Ensure column contains only numbers

---

## Logging Output (budget_allocation.log)

### Log Entry Format
```
TIMESTAMP - LEVEL - MESSAGE
2026-06-08 16:32:26,609 - INFO - Loaded 10 employee records
```

### Log Levels

#### INFO
- Normal operations
- File operations
- Processing milestones
- Success messages

#### WARNING
- Validation warnings
- Skipped records
- Data quality issues
- Non-fatal problems

#### ERROR
- Fatal errors
- Missing files
- Processing failures
- System errors

### Useful Log Messages

#### Success
```
INFO - Loaded 10 employee records from employee_budget_input.xlsx
INFO - Processed 10 valid employee records
INFO - Master file generated: MASTER_EMPLOYEE_OUTPUT_*.xlsx
INFO - ✓ Budget allocation processing completed successfully!
```

#### Warnings
```
WARNING - Skipped record at Row 25: Employee Level invalid
WARNING - Total validation errors: 3
```

#### Errors
```
ERROR - Input file not found: input/employee_budget_input.xlsx
ERROR - Missing columns: ['Fresh Allocation']
ERROR - Failed to process calculations
```

---

## Calculation Reference

### Employee Level Thresholds
| Level Range | Classification | Fresh Allocation | Rollover Cap |
|---|---|---|---|
| 1.0 - 5.9 | Junior | $1,500 | $300 |
| 6.0 - 6.0 | Transition | $1,500 | $300 |
| 6.1+ | Senior | $4,000 | $800 |

### Calculation Formulas

#### Fresh Allocation
```python
if level >= 6.1:
    fresh = 4000
else:
    fresh = 1500
```

#### Rollover Amount
```python
if balance <= 0:
    rollover = 0
else:
    if level >= 6.1:
        cap = 800
    else:
        cap = 300
    rollover = min(balance, cap)
```

#### Remaining Wallet
```python
remaining = balance - rollover
if remaining < 0:
    remaining = 0
```

#### BU Wallet Total
```python
bu_total = sum(remaining for all employees in BU)
```

---

## Data Quality Checklist

### Before Running Tool

- [ ] Excel file located at `input/employee_budget_input.xlsx`
- [ ] Sheet name is exactly `Employees`
- [ ] All 6 required columns present
- [ ] Column names match exactly (case-sensitive)
- [ ] Employee ID column has unique values
- [ ] Email ID column has valid format
- [ ] Employee Name column has values
- [ ] Meta Business Unit column has grouping values
- [ ] Employee Level column has numeric values (1-7 typical)
- [ ] Balance Budget column has numeric values ≥ 0
- [ ] No blank cells in required columns
- [ ] No data in rows above header

### After Running Tool

- [ ] Output folder created with files
- [ ] MASTER_EMPLOYEE_OUTPUT_*.xlsx generated
- [ ] BU_SUMMARY_OUTPUT_*.xlsx generated
- [ ] BU_*.xlsx files created (one per BU)
- [ ] Spot check calculations on 3-5 rows
- [ ] Verify BU totals sum correctly
- [ ] Check budget_allocation.log for errors
- [ ] Review VALIDATION_ERRORS_*.txt if present

---

## Examples

### Example Input Row (Level 1-6)
```
Employee ID: EMP001
Email ID: john.smith@company.com
Employee Name: John Smith
Meta Business Unit: HR
Employee Level: 3
Balance Budget: 150
```

**Expected Output:**
```
Fresh Allocation: 1500
Rollover Amount: 150 (MIN of 150 and 300)
Remaining Wallet: 0 (150 - 150)
```

### Example Input Row (Level 6.1+)
```
Employee ID: EMP004
Email ID: alice@company.com
Employee Name: Alice Johnson
Meta Business Unit: HR
Employee Level: 6.5
Balance Budget: 1200
```

**Expected Output:**
```
Fresh Allocation: 4000
Rollover Amount: 800 (MIN of 1200 and 800)
Remaining Wallet: 400 (1200 - 800)
```

### Example BU Aggregation
```
Business Unit: HR
Employees:
  - EMP001: Remaining = 0
  - EMP004: Remaining = 400
  - EMP007: Remaining = 0
  - EMP010: Remaining = 0

Total BU Wallet: 400
Total Employees: 4
Average Balance: 432.50
```

---

## Appendix

### File Extensions
- `.xlsx` - Excel 2007+ format (required)
- `.txt` - Plain text (error reports, logs)
- `.log` - Plain text (execution logs)
- `.py` - Python source code

### Data Type Summary
| Type | Meaning | Examples | Decimal Places |
|------|---------|----------|-----------------|
| Text | String of characters | Names, IDs | N/A |
| Integer | Whole number | 1, 2, 3 | 0 |
| Float | Decimal number | 6.1, 150.50 | 1-2 |
| Currency | Money amount | $1,500 | 2 |

### Common Issues & Resolution

| Issue | Resolution |
|-------|-----------|
| Numbers stored as text in Excel | Format column as Number |
| Excel formula showing instead of value | Press Ctrl+` to toggle formula view |
| #REF! errors in Excel | Likely import issue, re-check column names |
| Decimal numbers appearing as dates | Change column format to Number |
| Employee Level 6 treated as junior | Confirm value is 6.0, not 6.1 |

---

*LPL Quarterly Budget Allocation Tool - Data Dictionary v1.0*
