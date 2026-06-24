"""
Create sample input file for testing the Budget Allocation Tool.

Run: python create_sample_input.py
"""

import os
import pandas as pd
from pathlib import Path

def create_sample_input():
    """Generate sample employee data for testing."""

    # Create input directory
    Path("input").mkdir(exist_ok=True)

    # Sample data
    sample_data = {
        "Employee ID": [
            "EMP001", "EMP002", "EMP003", "EMP004", "EMP005",
            "EMP006", "EMP007", "EMP008", "EMP009", "EMP010",
        ],
        "Email ID": [
            "john.smith@company.com", "jane.doe@company.com", "bob.wilson@company.com",
            "alice.johnson@company.com", "charlie.brown@company.com",
            "diana.davis@company.com", "eve.martinez@company.com", "frank.anderson@company.com",
            "grace.taylor@company.com", "henry.white@company.com",
        ],
        "Employee Name": [
            "John Smith", "Jane Doe", "Bob Wilson", "Alice Johnson", "Charlie Brown",
            "Diana Davis", "Eve Martinez", "Frank Anderson", "Grace Taylor", "Henry White",
        ],
        "Meta Business Unit": [
            "HR", "Technology", "Finance", "HR", "Technology",
            "Finance", "HR", "Technology", "Finance", "HR",
        ],
        "Employee Level": [
            3, 5, 2, 6.5, 4,
            7, 1, 6.1, 5, 3,
        ],
        "Balance Budget": [
            150, 500, 0, 1200, 250,
            900, 100, 1500, 350, 280,
        ],
    }

    df = pd.DataFrame(sample_data)

    # Save to Excel
    output_path = "input/employee_budget_input.xlsx"
    df.to_excel(output_path, sheet_name="Employees", index=False)

    print(f"✓ Sample input file created: {output_path}")
    print(f"  - Records: {len(df)}")
    print(f"  - Business Units: {df['Meta Business Unit'].nunique()}")
    print("\nSample Data:")
    print(df.to_string(index=False))


if __name__ == "__main__":
    create_sample_input()
