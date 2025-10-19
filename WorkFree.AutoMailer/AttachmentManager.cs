using System;
using System.IO;
using System.Windows.Forms;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace WorkFree.AutoMailer
{
    public class AttachmentManager
    {
        private readonly ConfigManager configManager;

        public AttachmentManager(ConfigManager config)
        {
            this.configManager = config;
        }

        /// <summary>
        /// 메일의 첨부파일을 저장합니다
        /// </summary>
        public void SaveAttachments(Outlook.MailItem mailItem)
        {
            try
            {
                if (mailItem.Attachments.Count == 0)
                    return;

                string basePath = configManager.GetAttachmentSavePath();
                
                // 날짜별 폴더 구성이 활성화되어 있으면
                if (configManager.GetOrganizeByDate())
                {
                    string dateFolder = DateTime.Now.ToString("yyyy-MM-dd");
                    basePath = Path.Combine(basePath, dateFolder);
                }

                // 발신자별 폴더 생성
                string senderName = SanitizeFileName(mailItem.SenderName ?? "Unknown");
                string savePath = Path.Combine(basePath, senderName);

                // 폴더 생성
                if (!Directory.Exists(savePath))
                {
                    Directory.CreateDirectory(savePath);
                }

                // 첨부파일 저장
                foreach (Outlook.Attachment attachment in mailItem.Attachments)
                {
                    string fileName = attachment.FileName;
                    string fullPath = Path.Combine(savePath, fileName);

                    // 파일명 중복 처리
                    int counter = 1;
                    while (File.Exists(fullPath))
                    {
                        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
                        string extension = Path.GetExtension(fileName);
                        fullPath = Path.Combine(savePath, $"{fileNameWithoutExt}_{counter}{extension}");
                        counter++;
                    }

                    attachment.SaveAsFile(fullPath);
                    System.Diagnostics.Debug.WriteLine($"첨부파일 저장: {fullPath}");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"첨부파일 저장 오류: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// 선택한 메일의 첨부파일 수동 저장 (리본 버튼용)
        /// </summary>
        public void SaveSelectedMailAttachments()
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
                    if (mail.Attachments.Count == 0)
                    {
                        MessageBox.Show("첨부파일이 없습니다.", "WorkFree", 
                            MessageBoxButtons.OK, MessageBoxIcon.Information);
                        return;
                    }

                    SaveAttachments(mail);
                    MessageBox.Show($"{mail.Attachments.Count}개의 첨부파일을 저장했습니다!", 
                        "WorkFree", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// PDF 변환 후 저장 (향후 구현)
        /// </summary>
        public void ConvertToPdf(string sourceFile, string outputPath)
        {
            // TODO: Office Interop을 이용한 PDF 변환 로직
            // Excel, Word 파일을 PDF로 변환
            throw new NotImplementedException("PDF 변환 기능은 추후 구현 예정입니다.");
        }

        /// <summary>
        /// 파일명에서 사용 불가능한 문자 제거
        /// </summary>
        private string SanitizeFileName(string fileName)
        {
            char[] invalidChars = Path.GetInvalidFileNameChars();
            foreach (char c in invalidChars)
            {
                fileName = fileName.Replace(c, '_');
            }
            return fileName;
        }
    }
}


