using System;
using System.Linq;
using System.Windows.Forms;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace WorkFree.AutoMailer
{
    public class AutoReplyService
    {
        private readonly ConfigManager configManager;
        private readonly AttachmentManager attachmentManager;

        public AutoReplyService(ConfigManager config)
        {
            this.configManager = config;
            this.attachmentManager = new AttachmentManager(config);
        }

        /// <summary>
        /// 새로 수신된 메일을 처리합니다
        /// </summary>
        public void ProcessNewMail(Outlook.MailItem mailItem)
        {
            try
            {
                // 자동회신 기능이 비활성화되어 있으면 리턴
                if (!configManager.IsFeatureEnabled("autoReply"))
                    return;

                // 필터 조건 확인
                if (!ShouldReply(mailItem))
                    return;

                // 딜레이 적용 (설정값)
                System.Threading.Thread.Sleep(configManager.GetDelaySeconds() * 1000);

                // 자동 회신 생성
                Outlook.MailItem replyMail = mailItem.ReplyAll();
                
                // 회신 본문 작성
                string replyTemplate = configManager.GetReplyTemplate();
                replyMail.HTMLBody = replyTemplate + replyMail.HTMLBody;

                // 첨부파일 저장 기능이 활성화되어 있으면
                if (configManager.IsFeatureEnabled("attachmentSave") && mailItem.Attachments.Count > 0)
                {
                    attachmentManager.SaveAttachments(mailItem);
                }

                // PDF 변환 기능이 활성화되어 있으면
                if (configManager.IsFeatureEnabled("pdfConversion"))
                {
                    // TODO: PDF 변환 로직 구현
                }

                // 메일 발송
                replyMail.Send();

                // 로깅
                if (configManager.IsFeatureEnabled("logging"))
                {
                    LogReply(mailItem, "성공");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"자동회신 오류: {ex.Message}");
                
                if (configManager.IsFeatureEnabled("logging"))
                {
                    LogReply(mailItem, $"실패: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// 메일이 자동회신 조건에 맞는지 확인
        /// </summary>
        private bool ShouldReply(Outlook.MailItem mailItem)
        {
            // 제목에 키워드 포함 여부 확인
            var keywords = configManager.GetKeywords();
            bool hasKeyword = keywords.Any(keyword => 
                mailItem.Subject != null && mailItem.Subject.Contains(keyword));

            if (!hasKeyword)
                return false;

            // 발신자 도메인 필터 (있는 경우)
            var allowedDomains = configManager.GetAllowedDomains();
            if (allowedDomains.Any())
            {
                string senderEmail = mailItem.SenderEmailAddress ?? "";
                bool isDomainAllowed = allowedDomains.Any(domain => 
                    senderEmail.EndsWith(domain, StringComparison.OrdinalIgnoreCase));
                
                if (!isDomainAllowed)
                    return false;
            }

            // 제외 발신자 확인
            var excludedSenders = configManager.GetExcludedSenders();
            if (excludedSenders.Any())
            {
                string senderEmail = mailItem.SenderEmailAddress ?? "";
                if (excludedSenders.Contains(senderEmail))
                    return false;
            }

            return true;
        }

        /// <summary>
        /// 회신 내역을 로그 파일에 기록
        /// </summary>
        private void LogReply(Outlook.MailItem mailItem, string status)
        {
            try
            {
                string logPath = configManager.GetLogPath();
                string logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] " +
                                  $"발신자: {mailItem.SenderName} ({mailItem.SenderEmailAddress}), " +
                                  $"제목: {mailItem.Subject}, " +
                                  $"상태: {status}\n";

                System.IO.File.AppendAllText(logPath, logEntry);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"로그 기록 오류: {ex.Message}");
            }
        }

        /// <summary>
        /// 수동으로 선택한 메일 처리 (리본 버튼용)
        /// </summary>
        public void ProcessSelectedMail()
        {
            try
            {
                Outlook.Application app = Globals.ThisAddIn.Application;
                Outlook.Selection selected = app.ActiveExplorer().Selection;

                if (selected.Count == 0)
                {
                    MessageBox.Show("메일을 선택하세요.", "WorkFree", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }

                Outlook.MailItem mail = selected[1] as Outlook.MailItem;
                if (mail != null)
                {
                    ProcessNewMail(mail);
                    MessageBox.Show("자동회신을 실행했습니다!", "WorkFree", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}

