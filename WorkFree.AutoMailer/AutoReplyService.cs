// Outlook에서 특정 조건의 메일이 오면 자동으로 ReplyALL 회신을 보내고, 옵션에 따라 첨부 저장/로그 기록까지 하는 서비스
// 흐름(메인 시나리오) -> 조건(필터) -> 부가기능(첨부/로그) -> 수동 실행(리본)

// 기본 타입(DateTime, Exception 등) 사용
using System;
// Any(), Contains() 같은 LINQ 함수 사용
using System.Linq;
// MessageBox.Show() 같은 UI 메시지 박스 표시
using System.Windows.Forms;
// Outlook COM 라이브러리를 편하게 쓰기 위해 별칭(alias)
using Outlook = Microsoft.Office.Interop.Outlook;

namespace WorkFree.AutoMailer
{
    public class AutoReplyService
    {
        private readonly ConfigManager configManager;
        private readonly AttachmentManager attachmentManager;

        public AutoReplyService(ConfigManager config)
        {
            // 설정값 담당
            this.configManager = config;
            // 첨부파일 저장담당
            this.attachmentManager = new AttachmentManager(config);
        }

        /// <summary>
        /// 새로 수신된 메일을 처리합니다
        /// </summary>
        
        public void ProcessNewMail(Outlook.MailItem mailItem)
        {
            // Outlook 자동화는 예외가 꽤 자주 날 수 있어서(Com 관련,권한, 네트워크)
            // 전체 로직을 try/catch 로 해서 실패해도 프로그램 정상작동 가능
            
            try
            {
                // 자동회신 기능이 비활성화되어 있으면 즉시 종료
                if (!configManager.IsFeatureEnabled("autoReply"))
                    return;

                // 자동회신 대상이 아니면 바로 종료
                if (!ShouldReply(mailItem))
                    return;

                // 딜레이 적용 (설정값, 연속으로 들어오는 메일이 있을 때 완충 역활)
                System.Threading.Thread.Sleep(configManager.GetDelaySeconds() * 1000);

                // 자동 전체회신 메일객체생성(아직 작성 중인 상태, 미발송상태)
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
        /// 메일이 자동회신 조건에 맞는지 확인(이 메일에 회신할까?)
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
                // Null 일때, 대체값 ""
                // senderEmail 이 null 이면 null.EndsWith(...) 실행 불가 -> 미리 "" 로 바꿔서 false 로 안전하게 출력
                
                string senderEmail = mailItem.SenderEmailAddress ?? "";
                bool isDomainAllowed = allowedDomains.Any(domain => 
                    senderEmail.EndsWith(domain, StringComparison.OrdinalIgnoreCase));
                
                if (!isDomainAllowed)
                    return false;
            }

            // 제외 발신자 확인(자동 회신 금지)
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

            //예외 발생 시 사용자에게 메세지
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}

