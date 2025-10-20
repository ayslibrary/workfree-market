using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WorkFree.AutoMailer
{
    public class ConfigManager
    {
        private JObject config;
        private readonly string configPath;

        public ConfigManager()
        {
            // config.json 파일 경로
            string assemblyPath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            string assemblyDir = Path.GetDirectoryName(assemblyPath);
            configPath = Path.Combine(assemblyDir, "config.json");
        }

        /// <summary>
        /// config.json 파일을 로드합니다
        /// </summary>
        public void LoadConfig()
        {
            try
            {
                if (!File.Exists(configPath))
                {
                    throw new FileNotFoundException($"설정 파일을 찾을 수 없습니다: {configPath}");
                }

                string json = File.ReadAllText(configPath);
                config = JObject.Parse(json);
            }
            catch (Exception ex)
            {
                throw new Exception($"설정 파일 로드 실패: {ex.Message}");
            }
        }

        /// <summary>
        /// 특정 기능이 활성화되어 있는지 확인
        /// </summary>
        public bool IsFeatureEnabled(string featureName)
        {
            try
            {
                return config["features"][featureName]["enabled"].Value<bool>();
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 자동회신 키워드 목록 가져오기
        /// </summary>
        public List<string> GetKeywords()
        {
            try
            {
                return config["features"]["autoReply"]["keywords"]
                    .Values<string>()
                    .ToList();
            }
            catch
            {
                return new List<string>();
            }
        }

        /// <summary>
        /// 회신 템플릿 가져오기
        /// </summary>
        public string GetReplyTemplate()
        {
            try
            {
                return config["features"]["autoReply"]["replyTemplate"].Value<string>();
            }
            catch
            {
                return "<p>안녕하세요.<br>메일 잘 받았습니다.</p>";
            }
        }

        /// <summary>
        /// 첨부파일 저장 경로 가져오기
        /// </summary>
        public string GetAttachmentSavePath()
        {
            try
            {
                return config["features"]["attachmentSave"]["savePath"].Value<string>();
            }
            catch
            {
                return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "WorkFree", "Attachments");
            }
        }

        /// <summary>
        /// 날짜별 폴더 구성 여부
        /// </summary>
        public bool GetOrganizeByDate()
        {
            try
            {
                return config["features"]["attachmentSave"]["organizeByDate"].Value<bool>();
            }
            catch
            {
                return true;
            }
        }

        /// <summary>
        /// 로그 파일 경로 가져오기
        /// </summary>
        public string GetLogPath()
        {
            try
            {
                return config["features"]["logging"]["logPath"].Value<string>();
            }
            catch
            {
                return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "WorkFree", "Logs", "log.txt");
            }
        }

        /// <summary>
        /// 발송 딜레이 시간(초) 가져오기
        /// </summary>
        public int GetDelaySeconds()
        {
            try
            {
                return config["settings"]["delaySeconds"].Value<int>();
            }
            catch
            {
                return 2;
            }
        }

        /// <summary>
        /// 허용된 발신자 도메인 목록
        /// </summary>
        public List<string> GetAllowedDomains()
        {
            try
            {
                return config["filters"]["senderDomains"]
                    .Values<string>()
                    .ToList();
            }
            catch
            {
                return new List<string>();
            }
        }

        /// <summary>
        /// 제외할 발신자 목록
        /// </summary>
        public List<string> GetExcludedSenders()
        {
            try
            {
                return config["filters"]["excludeSenders"]
                    .Values<string>()
                    .ToList();
            }
            catch
            {
                return new List<string>();
            }
        }

        /// <summary>
        /// 설정 저장
        /// </summary>
        public void SaveConfig()
        {
            try
            {
                string json = JsonConvert.SerializeObject(config, Formatting.Indented);
                File.WriteAllText(configPath, json);
            }
            catch (Exception ex)
            {
                throw new Exception($"설정 저장 실패: {ex.Message}");
            }
        }
    }
}



