using System;
using System.Windows.Forms;
using Microsoft.Office.Core;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace WorkFree.AutoMailer
{
    public class RibbonController : IRibbonExtensibility
    {
        private IRibbonUI ribbon;

        public RibbonController()
        {
        }

        #region IRibbonExtensibility Members

        public string GetCustomUI(string ribbonID)
        {
            return GetResourceText("WorkFree.AutoMailer.Ribbon.xml");
        }

        #endregion

        #region Ribbon Callbacks

        public void Ribbon_Load(IRibbonUI ribbonUI)
        {
            this.ribbon = ribbonUI;
        }

        /// <summary>
        /// 자동회신 실행 버튼 클릭 핸들러
        /// </summary>
        public void OnClick_AutoReply(IRibbonControl control)
        {
            try
            {
                var autoReplyService = new AutoReplyService(Globals.ThisAddIn.ConfigManager);
                autoReplyService.ProcessSelectedMail();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// 첨부파일 저장 버튼 클릭 핸들러
        /// </summary>
        public void OnClick_SaveAttachment(IRibbonControl control)
        {
            try
            {
                var attachmentManager = new AttachmentManager(Globals.ThisAddIn.ConfigManager);
                attachmentManager.SaveSelectedMailAttachments();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// 설정 버튼 클릭 핸들러
        /// </summary>
        public void OnClick_Settings(IRibbonControl control)
        {
            try
            {
                MessageBox.Show("설정 창은 추후 구현 예정입니다.\n\n현재는 config.json 파일을 직접 수정해주세요.",
                    "WorkFree 설정",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"오류: {ex.Message}", "WorkFree 오류",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion

        #region Helpers

        private static string GetResourceText(string resourceName)
        {
            System.Reflection.Assembly asm = System.Reflection.Assembly.GetExecutingAssembly();
            string[] resourceNames = asm.GetManifestResourceNames();
            for (int i = 0; i < resourceNames.Length; ++i)
            {
                if (string.Compare(resourceName, resourceNames[i], StringComparison.OrdinalIgnoreCase) == 0)
                {
                    using (System.IO.StreamReader resourceReader = new System.IO.StreamReader(asm.GetManifestResourceStream(resourceNames[i])))
                    {
                        if (resourceReader != null)
                        {
                            return resourceReader.ReadToEnd();
                        }
                    }
                }
            }
            return null;
        }

        #endregion
    }
}


