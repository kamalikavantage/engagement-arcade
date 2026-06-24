# Deployment Checklist - LPL Budget Allocation Tool

## Phase 1: Pre-Deployment (Preparation)

### Code Review
- [ ] Review main.py for business logic correctness
- [ ] Verify config.py has correct allocation amounts
- [ ] Check utils.py calculation formulas
- [ ] Confirm error handling in all functions
- [ ] Review logging setup

### Testing
- [ ] Run sample data test: `python3 create_sample_input.py && python3 main.py`
- [ ] Verify all 5 output files generated
- [ ] Check calculations on 5 sample rows
- [ ] Verify BU aggregation totals
- [ ] Review error log for warnings
- [ ] Test with edge cases (zero balance, level 6.1, etc.)

### Documentation Review
- [ ] Read QUICK_START.md completely
- [ ] Review README_TOOL.md business logic section
- [ ] Check DATA_DICTIONARY.md for all field definitions
- [ ] Verify PROJECT_SUMMARY.md for completeness

### Environment Setup
- [ ] Confirm Python 3.7+ installed: `python3 --version`
- [ ] Install dependencies: `pip3 install -r requirements.txt`
- [ ] Verify pandas installed: `python3 -c "import pandas; print(pandas.__version__)"`
- [ ] Verify openpyxl installed: `python3 -c "import openpyxl; print(openpyxl.__version__)"`

### File Structure
- [ ] Create `input/` folder if not exists
- [ ] Create `output/` folder if not exists
- [ ] Verify read/write permissions on both folders
- [ ] Place all Python files in working directory

---

## Phase 2: Data Preparation

### Input File Preparation
- [ ] Create Excel file: `employee_budget_input.xlsx`
- [ ] Verify sheet name is exactly: `Employees`
- [ ] Confirm 6 required columns exist:
  - [ ] Employee ID
  - [ ] Email ID
  - [ ] Employee Name
  - [ ] Meta Business Unit
  - [ ] Employee Level
  - [ ] Balance Budget

### Data Validation
- [ ] Check for blank cells in required columns
- [ ] Verify Employee ID column is unique
- [ ] Confirm Balance Budget column has numeric values
- [ ] Verify Employee Level column has numeric values
- [ ] Check for negative balance values
- [ ] Ensure no extra blank rows at top
- [ ] Verify column names match exactly (case-sensitive)

### Data Quality
- [ ] Run sample of 50 rows through tool
- [ ] Review VALIDATION_ERRORS_*.txt if present
- [ ] Fix any data issues found
- [ ] Rerun sample test
- [ ] Verify all records pass validation

### Stakeholder Alignment
- [ ] Confirm allocation amounts with Finance
- [ ] Verify rollover cap amounts with HR
- [ ] Validate Business Unit names with Org
- [ ] Confirm employee level ranges
- [ ] Get sign-off on output format

---

## Phase 3: Pre-Production Testing

### Functionality Testing
- [ ] Run tool with full dataset
- [ ] Verify all calculations correct
- [ ] Check output file quality
- [ ] Review MASTER_EMPLOYEE_OUTPUT_*.xlsx:
  - [ ] All employees present
  - [ ] Fresh allocation values correct
  - [ ] Rollover calculations correct
  - [ ] Remaining wallet totals correct
  - [ ] Data sorted properly

### BU Output Testing
- [ ] Check BU_SUMMARY_OUTPUT_*.xlsx:
  - [ ] All BUs represented
  - [ ] Total wallet sums correct
  - [ ] Employee counts accurate
  - [ ] Average balances calculated correctly

### Individual BU Files Testing
- [ ] Verify all BU_*.xlsx files created
- [ ] Check employee counts per BU
- [ ] Verify calculations in each BU file
- [ ] Review BU_Summary sheet content

### Error Handling Testing
- [ ] Test with invalid employee level (non-numeric)
- [ ] Test with negative balance
- [ ] Test with missing column
- [ ] Test with blank cells
- [ ] Verify error messages are clear
- [ ] Check VALIDATION_ERRORS_*.txt reporting

### Performance Testing
- [ ] Time execution with full dataset
- [ ] Verify completes within acceptable time
- [ ] Check memory usage
- [ ] Monitor disk space for output

### Integration Testing
- [ ] Export data to target payroll system
- [ ] Verify import format compatibility
- [ ] Check data integrity post-import
- [ ] Validate calculations in target system

### Sign-Off Testing
- [ ] Get CFO/Finance approval on calculations
- [ ] Get HR approval on allocation logic
- [ ] Get BU leaders approval on reports
- [ ] Document all test results

---

## Phase 4: Deployment

### Environment Setup
- [ ] Deploy to production server/machine
- [ ] Copy all Python files to production
- [ ] Copy requirements.txt to production
- [ ] Verify folder structure created
- [ ] Set appropriate file permissions

### Initial Run
- [ ] Place input file in `input/` folder
- [ ] Run tool: `python3 main.py`
- [ ] Verify successful execution
- [ ] Check output files generated
- [ ] Review budget_allocation.log

### Output Verification
- [ ] Open all output files
- [ ] Spot check 10 random employee records
- [ ] Verify BU totals
- [ ] Check file naming with timestamps
- [ ] Confirm file sizes reasonable

### Stakeholder Delivery
- [ ] Send MASTER_EMPLOYEE_OUTPUT_*.xlsx to payroll
- [ ] Send BU_SUMMARY_OUTPUT_*.xlsx to finance
- [ ] Send individual BU_*.xlsx files to BU leaders
- [ ] Send execution log to audit
- [ ] Document delivery with date/time

---

## Phase 5: Post-Deployment

### Documentation
- [ ] File all output files for audit trail
- [ ] Archive execution logs
- [ ] Update runbook with actual execution time
- [ ] Document any issues encountered
- [ ] Create backup of outputs

### Stakeholder Communication
- [ ] Send summary email to finance team
- [ ] Notify payroll of file delivery
- [ ] Inform BU leaders of their specific reports
- [ ] Confirm all files received
- [ ] Address any questions

### Performance Monitoring
- [ ] Log execution metrics
- [ ] Monitor for any issues
- [ ] Track employee count processed
- [ ] Track error rate
- [ ] Document for trend analysis

### Process Documentation
- [ ] Document actual vs. planned time
- [ ] Note any unexpected behaviors
- [ ] Record any manual interventions needed
- [ ] Update troubleshooting guide if needed
- [ ] Plan for next quarter

---

## Phase 6: Automation Setup (Optional)

### Linux/Mac - Cron Scheduling
- [ ] Determine desired run time
- [ ] Edit crontab: `crontab -e`
- [ ] Add cron entry (example - weekly Monday 2 AM):
  ```
  0 2 * * 1 cd /path/to/tool && python3 main.py
  ```
- [ ] Verify cron entry: `crontab -l`
- [ ] Test cron execution
- [ ] Monitor first 3 scheduled runs

### Windows - Task Scheduler
- [ ] Open Task Scheduler
- [ ] Create new task
- [ ] Set trigger (recurring schedule)
- [ ] Set action (run python3 main.py)
- [ ] Set working directory to tool folder
- [ ] Test task execution
- [ ] Monitor first 3 scheduled runs

### Notification Setup
- [ ] Configure email on success
- [ ] Configure email on failure
- [ ] Send test notification
- [ ] Document recipients
- [ ] Set up logging to monitoring system

### Backup Strategy
- [ ] Backup input files daily
- [ ] Archive output files weekly
- [ ] Store execution logs
- [ ] Version control configuration
- [ ] Document disaster recovery

---

## Phase 7: Quality Assurance

### Accuracy Verification
- [ ] Manually verify 10 random calculations
- [ ] Compare against previous manual method
- [ ] Check for calculation discrepancies
- [ ] Validate against expected totals
- [ ] Get finance sign-off

### Completeness Check
- [ ] Verify no employees missing
- [ ] Check all BUs represented
- [ ] Confirm all levels processed
- [ ] Verify no duplicate employees
- [ ] Check for orphaned records

### Performance Validation
- [ ] Document actual run time
- [ ] Compare to estimated time
- [ ] Monitor resource usage
- [ ] Check output file sizes
- [ ] Verify no timeouts/errors

### Security Review
- [ ] Verify no sensitive data exposed
- [ ] Check file permissions set correctly
- [ ] Confirm audit trail complete
- [ ] Review logs for any issues
- [ ] Verify offline operation

### Compliance Check
- [ ] Confirm GDPR compliance if applicable
- [ ] Verify SOX compliance if required
- [ ] Check data retention policy
- [ ] Confirm backup strategy
- [ ] Document compliance verification

---

## Phase 8: Handover & Training

### Knowledge Transfer
- [ ] Train support team on running tool
- [ ] Train support team on troubleshooting
- [ ] Review all documentation
- [ ] Practice sample execution
- [ ] Conduct dry run

### Documentation Delivery
- [ ] Provide all source code files
- [ ] Provide all documentation
- [ ] Provide this checklist
- [ ] Provide sample data files
- [ ] Provide troubleshooting guide

### Support Preparation
- [ ] Identify support person/team
- [ ] Create escalation procedure
- [ ] Document common issues
- [ ] Prepare troubleshooting scripts
- [ ] Set up help resources

### Maintenance Plan
- [ ] Document update procedure
- [ ] Plan for quarterly review
- [ ] Schedule backups
- [ ] Plan for monitoring
- [ ] Document change control

---

## Phase 9: Ongoing Monitoring

### Weekly
- [ ] Check execution logs
- [ ] Verify no errors in processing
- [ ] Confirm output files generated
- [ ] Check disk space usage
- [ ] Monitor performance metrics

### Monthly
- [ ] Review execution statistics
- [ ] Check for trends/anomalies
- [ ] Verify business logic still valid
- [ ] Update documentation
- [ ] Plan for next improvements

### Quarterly
- [ ] Full system review
- [ ] Performance analysis
- [ ] Security audit
- [ ] Accuracy verification
- [ ] Planning for next quarter

### Annually
- [ ] Complete system assessment
- [ ] Performance benchmarking
- [ ] Security review
- [ ] Compliance verification
- [ ] Plan for improvements

---

## Rollback Plan

### If Issues Found in Production

1. **Immediate Actions**
   - [ ] Stop automated processing
   - [ ] Notify stakeholders
   - [ ] Preserve error logs
   - [ ] Preserve output files

2. **Investigation**
   - [ ] Identify root cause
   - [ ] Check recent changes
   - [ ] Review error messages
   - [ ] Test in non-prod

3. **Rollback Decision**
   - [ ] Use previous version
   - [ ] Use manual calculations
   - [ ] Delay deployment
   - [ ] Document decision

4. **Recovery**
   - [ ] Restore from backup
   - [ ] Reprocess with old tool
   - [ ] Deliver with notes
   - [ ] Plan fix for next run

5. **Root Cause Analysis**
   - [ ] Determine what failed
   - [ ] Fix root cause
   - [ ] Add tests to prevent recurrence
   - [ ] Document lessons learned

---

## Sign-Off

### Deployment Manager
- [ ] Name: ___________________
- [ ] Date: ____________________
- [ ] Sign-Off: Approved / Rejected

### Finance Lead
- [ ] Name: ___________________
- [ ] Date: ____________________
- [ ] Sign-Off: Approved / Rejected

### IT Manager
- [ ] Name: ___________________
- [ ] Date: ____________________
- [ ] Sign-Off: Approved / Rejected

### HR Lead
- [ ] Name: ___________________
- [ ] Date: ____________________
- [ ] Sign-Off: Approved / Rejected

---

## Deployment Summary

**Project:** LPL Quarterly Budget Allocation Tool  
**Version:** 1.0  
**Deployment Date:** ________________  
**Production Start Date:** ________________  
**Expected Run Time:** ~2 seconds (10K employees)  
**Contact:** ________________  
**Support Email:** ________________  
**Escalation Contact:** ________________  

---

## Reference Links

- Documentation: See INDEX.md
- Source Code: main.py, config.py, utils.py
- Sample Data: create_sample_input.py
- Troubleshooting: README_TOOL.md
- Technical Details: IMPLEMENTATION_GUIDE.md

---

**Deployment Checklist v1.0**  
*LPL Quarterly Budget Allocation Tool*  
*Last Updated: 2026-06-08*
