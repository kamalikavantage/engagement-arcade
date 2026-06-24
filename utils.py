"""Utility functions for budget allocation calculations."""

import logging
from config import FRESH_ALLOCATION, ROLLOVER_CAPS

logger = logging.getLogger(__name__)


def is_senior_level(level):
    """
    Determine if employee level is senior (6.1+) or junior (1-6).

    Args:
        level: Employee level (int or float)

    Returns:
        bool: True if level >= 6.1, False otherwise
    """
    try:
        return float(level) >= 6.1
    except (ValueError, TypeError):
        logger.warning(f"Invalid employee level: {level}")
        return False


def calculate_fresh_allocation(level):
    """
    Calculate fresh allocation based on employee level.

    Args:
        level: Employee level (int or float)

    Returns:
        int: Fresh allocation amount
    """
    if is_senior_level(level):
        return FRESH_ALLOCATION["6_1_plus"]
    else:
        return FRESH_ALLOCATION["1_to_6"]


def calculate_rollover(balance, level):
    """
    Calculate rollover amount based on balance and employee level.

    Rules:
    - If Balance = 0 → Rollover = 0
    - If Balance <= Cap → Rollover = Balance
    - If Balance > Cap → Rollover = Cap

    Args:
        balance: Current balance budget (float)
        level: Employee level (int or float)

    Returns:
        float: Rollover amount
    """
    try:
        balance = float(balance)

        if balance <= 0:
            return 0.0

        # Get cap based on level
        cap = ROLLOVER_CAPS["6_1_plus"] if is_senior_level(level) else ROLLOVER_CAPS["1_to_6"]

        # Return min(balance, cap)
        return min(balance, cap)
    except (ValueError, TypeError):
        logger.warning(f"Invalid balance value: {balance}")
        return 0.0


def calculate_remaining_wallet(balance, rollover):
    """
    Calculate remaining BU wallet contribution.

    Formula: Remaining Wallet = Balance - Rollover

    Args:
        balance: Current balance budget (float)
        rollover: Calculated rollover amount (float)

    Returns:
        float: Remaining BU wallet contribution
    """
    try:
        balance = float(balance)
        rollover = float(rollover)
        result = balance - rollover
        return max(result, 0.0)  # Ensure non-negative
    except (ValueError, TypeError):
        logger.warning(f"Invalid calculation input - Balance: {balance}, Rollover: {rollover}")
        return 0.0


def validate_employee_record(record):
    """
    Validate employee record for required fields.

    Args:
        record (dict): Employee record

    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = ["Employee ID", "Email ID", "Employee Name", "Meta Business Unit",
                       "Employee Level", "Balance Budget"]

    # Check for missing fields
    for field in required_fields:
        if field not in record or (isinstance(record[field], float) and
                                   str(record[field]) == 'nan'):
            return False, f"Missing field: {field}"

    # Check for negative balance
    try:
        if float(record["Balance Budget"]) < 0:
            return False, f"Negative balance: {record['Balance Budget']}"
    except (ValueError, TypeError):
        return False, f"Invalid balance value: {record['Balance Budget']}"

    # Check for invalid employee level
    try:
        float(record["Employee Level"])
    except (ValueError, TypeError):
        return False, f"Invalid employee level: {record['Employee Level']}"

    return True, ""


def format_currency(value):
    """Format value as currency (2 decimal places)."""
    return round(float(value), 2)
