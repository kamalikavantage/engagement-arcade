"""
LPL Quarterly Budget Allocation & BU Wallet Automation Tool

This tool processes employee budget data and generates quarterly allocations
with separate files for each Meta Business Unit.

Run: python main.py
"""

import os
import sys
import logging
import pandas as pd
from datetime import datetime
from pathlib import Path

from config import (
    INPUT_FOLDER, OUTPUT_FOLDER, INPUT_FILENAME, SHEET_NAME,
    LOG_FORMAT, LOG_FILE, COLUMNS, OUTPUT_MASTER, OUTPUT_BU_SUMMARY, BU_FILE_PREFIX
)
from utils import (
    calculate_fresh_allocation, calculate_rollover, calculate_remaining_wallet,
    validate_employee_record, format_currency
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class BudgetAllocationProcessor:
    """Main processor for budget allocation calculations."""

    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.df = None
        self.processed_df = None
        self.bu_summary = None
        self.validation_errors = []

    def ensure_directories(self):
        """Create input and output directories if they don't exist."""
        Path(INPUT_FOLDER).mkdir(exist_ok=True)
        Path(OUTPUT_FOLDER).mkdir(exist_ok=True)
        logger.info(f"Directories created/verified: {INPUT_FOLDER}, {OUTPUT_FOLDER}")

    def load_input_file(self):
        """
        Load and validate input Excel file.

        Returns:
            bool: True if file loaded successfully
        """
        input_path = os.path.join(INPUT_FOLDER, INPUT_FILENAME)

        if not os.path.exists(input_path):
            logger.error(f"Input file not found: {input_path}")
            return False

        try:
            self.df = pd.read_excel(input_path, sheet_name=SHEET_NAME)
            logger.info(f"Loaded {len(self.df)} employee records from {INPUT_FILENAME}")

            # Validate required input columns only (not calculated columns)
            required_cols = [
                COLUMNS['employee_id'],
                COLUMNS['email'],
                COLUMNS['name'],
                COLUMNS['bu'],
                COLUMNS['level'],
                COLUMNS['balance']
            ]
            missing_cols = [col for col in required_cols if col not in self.df.columns]
            if missing_cols:
                logger.error(f"Missing columns: {missing_cols}")
                return False

            return True
        except Exception as e:
            logger.error(f"Error loading input file: {e}")
            return False

    def process_calculations(self):
        """
        Apply budget allocation calculations to all employee records.

        Returns:
            bool: True if processing successful
        """
        if self.df is None or self.df.empty:
            logger.error("No data to process")
            return False

        try:
            # Copy dataframe for processing
            self.processed_df = self.df.copy()

            # Validate and process each row
            valid_rows = []
            for idx, row in self.processed_df.iterrows():
                record = row.to_dict()
                is_valid, error_msg = validate_employee_record(record)

                if not is_valid:
                    self.validation_errors.append(
                        f"Row {idx + 2}: {record.get(COLUMNS['employee_id'], 'Unknown')} - {error_msg}"
                    )
                    continue

                # Calculate allocations
                level = record[COLUMNS['level']]
                balance = record[COLUMNS['balance']]

                self.processed_df.at[idx, COLUMNS['fresh_allocation']] = \
                    format_currency(calculate_fresh_allocation(level))

                rollover = calculate_rollover(balance, level)
                self.processed_df.at[idx, COLUMNS['rollover']] = format_currency(rollover)

                remaining = calculate_remaining_wallet(balance, rollover)
                self.processed_df.at[idx, COLUMNS['remaining_wallet']] = format_currency(remaining)

                valid_rows.append(idx)

            # Keep only valid rows
            self.processed_df = self.processed_df.loc[valid_rows]

            logger.info(f"Processed {len(self.processed_df)} valid employee records")
            if self.validation_errors:
                logger.warning(f"Validation errors found: {len(self.validation_errors)}")
                for error in self.validation_errors[:10]:  # Log first 10 errors
                    logger.warning(f"  {error}")
                if len(self.validation_errors) > 10:
                    logger.warning(f"  ... and {len(self.validation_errors) - 10} more errors")

            return len(self.processed_df) > 0

        except Exception as e:
            logger.error(f"Error during calculations: {e}")
            return False

    def calculate_bu_summary(self):
        """
        Calculate BU-level summary statistics.

        Returns:
            pd.DataFrame: BU summary data
        """
        try:
            bu_data = []

            for bu in self.processed_df[COLUMNS['bu']].unique():
                bu_df = self.processed_df[self.processed_df[COLUMNS['bu']] == bu]

                total_wallet = bu_df[COLUMNS['remaining_wallet']].sum()
                employee_count = len(bu_df)
                avg_balance = bu_df[COLUMNS['balance']].mean()

                bu_data.append({
                    'Meta Business Unit': bu,
                    'Total BU Wallet': format_currency(total_wallet),
                    'Total Employees in BU': employee_count,
                    'Average Balance Budget': format_currency(avg_balance)
                })

            self.bu_summary = pd.DataFrame(bu_data).sort_values('Meta Business Unit')
            logger.info(f"BU summary calculated for {len(self.bu_summary)} BUs")
            return self.bu_summary

        except Exception as e:
            logger.error(f"Error calculating BU summary: {e}")
            return None

    def generate_master_file(self):
        """
        Generate master employee output file with all records and calculations.

        Returns:
            bool: True if file generated successfully
        """
        if self.processed_df is None or self.processed_df.empty:
            logger.error("No data to generate master file")
            return False

        try:
            # Select and order columns
            output_cols = [
                COLUMNS['employee_id'],
                COLUMNS['email'],
                COLUMNS['name'],
                COLUMNS['bu'],
                COLUMNS['level'],
                COLUMNS['balance'],
                COLUMNS['fresh_allocation'],
                COLUMNS['rollover'],
                COLUMNS['remaining_wallet']
            ]

            output_df = self.processed_df[output_cols].copy()
            output_df = output_df.sort_values(by=[COLUMNS['bu'], COLUMNS['employee_id']])

            # Generate filename with timestamp
            filename = f"{OUTPUT_MASTER}_{self.timestamp}.xlsx"
            filepath = os.path.join(OUTPUT_FOLDER, filename)

            # Write to Excel
            output_df.to_excel(filepath, sheet_name=SHEET_NAME, index=False)
            logger.info(f"Master file generated: {filename}")

            return True

        except Exception as e:
            logger.error(f"Error generating master file: {e}")
            return False

    def generate_bu_summary_file(self):
        """
        Generate BU summary output file.

        Returns:
            bool: True if file generated successfully
        """
        if self.bu_summary is None or self.bu_summary.empty:
            logger.error("No BU summary data to generate file")
            return False

        try:
            filename = f"{OUTPUT_BU_SUMMARY}_{self.timestamp}.xlsx"
            filepath = os.path.join(OUTPUT_FOLDER, filename)

            self.bu_summary.to_excel(filepath, sheet_name="BU Summary", index=False)
            logger.info(f"BU summary file generated: {filename}")

            return True

        except Exception as e:
            logger.error(f"Error generating BU summary file: {e}")
            return False

    def generate_individual_bu_files(self):
        """
        Generate individual Excel files for each Meta Business Unit.

        Returns:
            bool: True if all files generated successfully
        """
        if self.processed_df is None or self.processed_df.empty:
            logger.error("No data to generate individual BU files")
            return False

        try:
            bus = self.processed_df[COLUMNS['bu']].unique()
            success_count = 0

            for bu in sorted(bus):
                bu_df = self.processed_df[self.processed_df[COLUMNS['bu']] == bu].copy()

                # Select columns for BU file
                output_cols = [
                    COLUMNS['employee_id'],
                    COLUMNS['email'],
                    COLUMNS['name'],
                    COLUMNS['level'],
                    COLUMNS['balance'],
                    COLUMNS['fresh_allocation'],
                    COLUMNS['rollover'],
                    COLUMNS['remaining_wallet']
                ]

                bu_output_df = bu_df[output_cols].sort_values(by=COLUMNS['employee_id'])

                # Create filename (sanitize BU name)
                bu_safe = bu.replace(" ", "_").replace("/", "_").replace("\\", "_")[:50]
                filename = f"{BU_FILE_PREFIX}{bu_safe}_{self.timestamp}.xlsx"
                filepath = os.path.join(OUTPUT_FOLDER, filename)

                # Create Excel writer to add summary sheet
                with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
                    # Employee data sheet
                    bu_output_df.to_excel(writer, sheet_name="Employees", index=False)

                    # Summary sheet
                    total_wallet = bu_df[COLUMNS['remaining_wallet']].sum()
                    summary_data = {
                        'Metric': ['Meta Business Unit', 'Total Employees', 'Total BU Wallet'],
                        'Value': [bu, len(bu_df), format_currency(total_wallet)]
                    }
                    summary_df = pd.DataFrame(summary_data)
                    summary_df.to_excel(writer, sheet_name="BU_Summary", index=False)

                logger.info(f"BU file generated: {filename} ({len(bu_df)} employees)")
                success_count += 1

            logger.info(f"All {success_count} individual BU files generated successfully")
            return True

        except Exception as e:
            logger.error(f"Error generating individual BU files: {e}")
            return False

    def generate_validation_report(self):
        """Generate validation report for rejected records."""
        if not self.validation_errors:
            return

        try:
            filename = f"VALIDATION_ERRORS_{self.timestamp}.txt"
            filepath = os.path.join(OUTPUT_FOLDER, filename)

            with open(filepath, 'w') as f:
                f.write("VALIDATION ERRORS REPORT\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Total Errors: {len(self.validation_errors)}\n")
                f.write("=" * 80 + "\n\n")

                for error in self.validation_errors:
                    f.write(f"{error}\n")

            logger.info(f"Validation report generated: {filename}")

        except Exception as e:
            logger.error(f"Error generating validation report: {e}")

    def run(self):
        """Execute the complete budget allocation process."""
        logger.info("=" * 80)
        logger.info("LPL Quarterly Budget Allocation & BU Wallet Automation Tool")
        logger.info(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info("=" * 80)

        # Step 1: Ensure directories
        self.ensure_directories()

        # Step 2: Load input
        if not self.load_input_file():
            logger.error("Failed to load input file. Exiting.")
            return False

        # Step 3: Process calculations
        if not self.process_calculations():
            logger.error("Failed to process calculations. Exiting.")
            return False

        # Step 4: Calculate BU summary
        if self.calculate_bu_summary() is None:
            logger.error("Failed to calculate BU summary. Exiting.")
            return False

        # Step 5: Generate output files
        success = True
        success &= self.generate_master_file()
        success &= self.generate_bu_summary_file()
        success &= self.generate_individual_bu_files()

        # Step 6: Generate validation report if needed
        self.generate_validation_report()

        # Final summary
        logger.info("=" * 80)
        if success:
            logger.info("✓ Budget allocation processing completed successfully!")
            logger.info(f"  - Employees processed: {len(self.processed_df)}")
            logger.info(f"  - Business Units: {len(self.bu_summary)}")
            logger.info(f"  - Output folder: {OUTPUT_FOLDER}")
            logger.info(f"  - Timestamp: {self.timestamp}")
        else:
            logger.warning("⚠ Budget allocation processing completed with errors.")
        logger.info("=" * 80)

        return success


def main():
    """Main entry point."""
    processor = BudgetAllocationProcessor()
    success = processor.run()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
