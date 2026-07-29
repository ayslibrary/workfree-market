import os
import time
import datetime
import schedule
import win32com.client

# ==============================================================================
# WorkFree Standalone Python AI Agent Scheduler
# Runs 24/7 in background -> Triggers VBA Macro & Email Alert automatically
# ==============================================================================

WORK_DIR = r"C:\Automation"
DATA_DIR = os.path.join(WORK_DIR, "Data")
REPORT_DIR = os.path.join(WORK_DIR, "Reports")
LOG_DIR = os.path.join(WORK_DIR, "Logs")
MASTER_EXCEL = os.path.join(WORK_DIR, "Daily_Master.xlsm")

def setup_folders():
    for folder in [WORK_DIR, DATA_DIR, REPORT_DIR, LOG_DIR]:
        if not os.path.exists(folder):
            os.makedirs(folder)

def run_vba_agent_job():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{now_str}] 🚀 Daily AI Agent Triggered!")
    
    setup_folders()
    
    if not os.path.exists(MASTER_EXCEL):
        print(f"[{now_str}] ⚠️ Master Excel not found at {MASTER_EXCEL}. Waiting for next trigger...")
        return

    try:
        # Launch Invisible Excel Process
        excel = win32com.client.Dispatch("Excel.Application")
        excel.Visible = False
        excel.DisplayAlerts = False
        
        wb = excel.Workbooks.Open(MASTER_EXCEL)
        excel.Application.Run("DailyAutomationModule.Run_Daily_Processing")
        
        wb.Save()
        wb.Close(False)
        excel.Quit()
        
        print(f"[{now_str}] ✅ Daily Processing & Executive Report Complete!")
    except Exception as e:
        print(f"[{now_str}] ❌ Error during execution: {e}")

# Schedule Daily Execution at 08:30 AM
schedule.every().day.at("08:30").do(run_vba_agent_job)

if __name__ == "__main__":
    print("🤖 WorkFree Zero-Touch Daily Agent Started...")
    print("⏰ Waiting for daily 08:30 AM Trigger...")
    
    # Run once immediately on launch for verification
    run_vba_agent_job()
    
    while True:
        schedule.run_pending()
        time.sleep(30)
