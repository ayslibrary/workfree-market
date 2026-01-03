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
                    // 오늘 날짜 폴더 yyyy-MM-dd 이름 생성, basePath 를 C:\...\yyyy-MM-dd 이름으로 바꿈
                    string dateFolder = DateTime.Now.ToString("yyyy-MM-dd");
                    basePath = Path.Combine(basePath, dateFolder);
                }

                // 발신자별 폴더 생성(파일/폴더 이름에 쓸 수 없는 특수문자 있을 수 있어 SanitizeFileName()으로 치환, senderName 이 Null 이면 Unknown 으로 대체)
                string senderName = SanitizeFileName(mailItem.SenderName ?? "Unknown");
                string savePath = Path.Combine(basePath, senderName);

                // 폴더 생성(폴더 없으면 생성)
                if (!Directory.Exists(savePath))
                {
                    Directory.CreateDirectory(savePath);
                }

                // 첨부파일 하나씩 저장
                foreach (Outlook.Attachment attachment in mailItem.Attachments)
                {
                    string fileName = attachment.FileName;
                    string fullPath = Path.Combine(savePath, fileName);

                    // 파일명 중복 처리
                    // GetFileNameWithoutExtension(String) -> 확장명 없이 지정된 경로 문자열의 파일 이름을 반환
                    
                    int counter = 1;
                    while (File.Exists(fullPath))
                    {
                        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
                        string extension = Path.GetExtension(fileName);
                        fullPath = Path.Combine(savePath, $"{fileNameWithoutExt}_{counter}{extension}");
                        counter++;
                    }

                    attachment.SaveAsFile(fullPath);
                    System.Diagnostics.Debug.WriteLine($"첨부파일 저장: {fullPath}"); // debug 출력로그 남김
                }
            }

            // 오류 로그 남김(상위 호출자가 "저장실패" 알 수 있음)
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"첨부파일 저장 오류: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// 선택한 메일의 첨부파일 수동 저장 (리본 버튼용(메뉴 버튼))
        /// </summary>
        public void SaveSelectedMailAttachments()
        {
            try
            {
                // Outlook 객체 가져오기, 열린 탐색
                
                Outlook.Application app = Globals.ThisAddIn.Application;
                Outlook.Selection selected = app.ActiveExplorer().Selection;

                // 선택된 메일이 없을 

                if (selected.Count == 0)
                {
                    MessageBox.Show("메일을 선택하세요.", "WorkFree", 
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }

                // 첫번째 항목을 첫 번째 선택 항목을 MailItem으로 캐스팅(Outlook Selection은 1부터 시작하는 인덱스)

                // 메일이면 첨부파일 유무 검사 후 저장
                
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
            // 오류는 메시지박스로 표시
            
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류", 
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// PDF 변환 후 저장 (향후 구현 예정)
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



