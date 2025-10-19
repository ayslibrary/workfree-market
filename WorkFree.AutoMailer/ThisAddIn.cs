using System;
using System.Windows.Forms;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace WorkFree.AutoMailer
{
    public partial class ThisAddIn
    {
        private Outlook.Inspectors inspectors;
        private AutoReplyService autoReplyService;
        private ConfigManager configManager;

        private void ThisAddIn_Startup(object sender, System.EventArgs e)
        {
            try
            {
                // 설정 로드
                configManager = new ConfigManager();
                configManager.LoadConfig();

                // 자동회신 서비스 초기화
                autoReplyService = new AutoReplyService(configManager);

                // 새 메일 수신 이벤트 등록
                Outlook.Application app = this.Application;
                Outlook.NameSpace ns = app.GetNamespace("MAPI");
                Outlook.MAPIFolder inbox = ns.GetDefaultFolder(Outlook.OlDefaultFolders.olFolderInbox);
                Outlook.Items items = inbox.Items;
                
                // 새 메일 이벤트 핸들러 등록
                items.ItemAdd += new Outlook.ItemsEvents_ItemAddEventHandler(OnNewMailReceived);

                MessageBox.Show("WorkFree AutoMailer가 시작되었습니다!", "WorkFree", 
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"초기화 오류: {ex.Message}", "WorkFree 오류", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void OnNewMailReceived(object Item)
        {
            try
            {
                Outlook.MailItem mailItem = Item as Outlook.MailItem;
                if (mailItem != null)
                {
                    // 자동회신 조건 확인 및 처리
                    autoReplyService.ProcessNewMail(mailItem);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"메일 처리 오류: {ex.Message}");
            }
        }

        private void ThisAddIn_Shutdown(object sender, System.EventArgs e)
        {
            // 정리 작업
        }

        #region VSTO generated code

        /// <summary>
        /// Designer support - do not modify
        /// </summary>
        private void InternalStartup()
        {
            this.Startup += new System.EventHandler(ThisAddIn_Startup);
            this.Shutdown += new System.EventHandler(ThisAddIn_Shutdown);
        }
        
        #endregion
    }
}


