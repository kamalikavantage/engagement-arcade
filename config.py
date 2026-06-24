"""Configuration constants for Budget Allocation Tool."""

# Fresh Allocation by Employee Level
FRESH_ALLOCATION = {
    "1_to_6": 1500,      # Levels 1 to 6
    "6_1_plus": 4000     # Levels 6.1 and above
}

# Rollover Caps by Employee Level
ROLLOVER_CAPS = {
    "1_to_6": 300,       # Levels 1 to 6
    "6_1_plus": 800      # Levels 6.1 and above
}

# File paths
INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"
INPUT_FILENAME = "employee_budget_input.xlsx"

# Excel sheet name
SHEET_NAME = "Employees"

# Logging configuration
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
LOG_FILE = 'budget_allocation.log'

# Column names
COLUMNS = {
    "employee_id": "Employee ID",
    "email": "Email ID",
    "name": "Employee Name",
    "bu": "Meta Business Unit",
    "level": "Employee Level",
    "balance": "Balance Budget",
    "fresh_allocation": "Fresh Allocation",
    "rollover": "Rollover Amount",
    "remaining_wallet": "Remaining BU Wallet Contribution"
}

# Output file names (without timestamp)
OUTPUT_MASTER = "MASTER_EMPLOYEE_OUTPUT"
OUTPUT_BU_SUMMARY = "BU_SUMMARY_OUTPUT"
BU_FILE_PREFIX = "BU_"
