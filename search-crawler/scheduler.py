"""
WorkFree 뉴스 자동발송 스케줄러
정해진 시간에 자동으로 뉴스 브리핑 이메일 발송
"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from pytz import timezone
import logging
from datetime import datetime
from typing import List, Dict, Optional
import json

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 스케줄러 초기화
jobstores = {
    'default': SQLAlchemyJobStore(url='sqlite:///schedules.db')
}

scheduler = BackgroundScheduler(
    jobstores=jobstores,
    timezone=timezone('Asia/Seoul')
)

class SchedulerManager:
    """스케줄 관리 클래스"""
    
    def __init__(self):
        self.scheduler = scheduler
        self.timezone = timezone('Asia/Seoul')
    
    def start(self):
        """스케줄러 시작"""
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("✅ 스케줄러 시작됨")
    
    def shutdown(self):
        """스케줄러 종료"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("🛑 스케줄러 종료됨")
    
    def add_user_schedule(
        self,
        user_id: str,
        email: str,
        keywords: List[str],
        time_str: str,  # "08:00" 형식
        weekdays: List[int],  # [0,1,2,3,4] = 월-금
        max_results: int = 10,
        engines: List[str] = ["naver"]
    ) -> Dict:
        """
        사용자별 브리핑 스케줄 등록
        
        Args:
            user_id: 사용자 ID
            email: 수신 이메일
            keywords: 검색 키워드 리스트
            time_str: "08:00" 형식
            weekdays: [0,1,2,3,4] (월-금)
            max_results: 검색 결과 개수
            engines: 검색 엔진 리스트
        
        Returns:
            스케줄 정보
        """
        try:
            hour, minute = map(int, time_str.split(':'))
            
            # 요일을 문자열로 변환 (0=월요일, 6=일요일)
            weekday_str = ','.join(map(str, weekdays))
            
            job_id = f'briefing_{user_id}'
            
            # 기존 스케줄 삭제 (있으면)
            self.remove_schedule(user_id)
            
            # 새 스케줄 추가
            trigger = CronTrigger(
                day_of_week=weekday_str,
                hour=hour,
                minute=minute,
                timezone=self.timezone
            )
            
            # 작업 데이터
            job_data = {
                'user_id': user_id,
                'email': email,
                'keywords': keywords,
                'max_results': max_results,
                'engines': engines
            }
            
            self.scheduler.add_job(
                func=send_scheduled_briefing,
                trigger=trigger,
                args=[job_data],
                id=job_id,
                replace_existing=True,
                name=f'Briefing for {email}'
            )
            
            logger.info(f"✅ 스케줄 등록: {email} - 매주 {weekdays} {time_str}")
            
            # 다음 실행 시간
            next_run = self.get_next_run_time(user_id)
            
            return {
                'success': True,
                'job_id': job_id,
                'user_id': user_id,
                'email': email,
                'keywords': keywords,
                'time': time_str,
                'weekdays': weekdays,
                'next_run': next_run.isoformat() if next_run else None,
                'message': f'스케줄이 등록되었습니다. 다음 실행: {next_run}'
            }
            
        except Exception as e:
            logger.error(f"❌ 스케줄 등록 실패: {e}")
            raise Exception(f"스케줄 등록 실패: {str(e)}")
    
    def remove_schedule(self, user_id: str) -> bool:
        """스케줄 삭제"""
        job_id = f'briefing_{user_id}'
        
        try:
            self.scheduler.remove_job(job_id)
            logger.info(f"🗑️ 스케줄 삭제: {user_id}")
            return True
        except Exception as e:
            logger.warning(f"⚠️ 스케줄 삭제 실패 (존재하지 않음): {user_id}")
            return False
    
    def get_schedule(self, user_id: str) -> Optional[Dict]:
        """사용자 스케줄 조회"""
        job_id = f'briefing_{user_id}'
        
        try:
            job = self.scheduler.get_job(job_id)
            if job:
                next_run = job.next_run_time
                return {
                    'job_id': job_id,
                    'user_id': user_id,
                    'name': job.name,
                    'next_run': next_run.isoformat() if next_run else None,
                    'trigger': str(job.trigger)
                }
            return None
        except Exception as e:
            logger.error(f"❌ 스케줄 조회 실패: {e}")
            return None
    
    def get_all_schedules(self) -> List[Dict]:
        """모든 스케줄 조회"""
        jobs = self.scheduler.get_jobs()
        schedules = []
        
        for job in jobs:
            next_run = job.next_run_time
            schedules.append({
                'job_id': job.id,
                'name': job.name,
                'next_run': next_run.isoformat() if next_run else None,
                'trigger': str(job.trigger)
            })
        
        return schedules
    
    def get_next_run_time(self, user_id: str):
        """다음 실행 시간 조회"""
        job_id = f'briefing_{user_id}'
        
        try:
            job = self.scheduler.get_job(job_id)
            return job.next_run_time if job else None
        except:
            return None
    
    def pause_schedule(self, user_id: str) -> bool:
        """스케줄 일시정지"""
        job_id = f'briefing_{user_id}'
        
        try:
            self.scheduler.pause_job(job_id)
            logger.info(f"⏸️ 스케줄 일시정지: {user_id}")
            return True
        except Exception as e:
            logger.error(f"❌ 일시정지 실패: {e}")
            return False
    
    def resume_schedule(self, user_id: str) -> bool:
        """스케줄 재개"""
        job_id = f'briefing_{user_id}'
        
        try:
            self.scheduler.resume_job(job_id)
            logger.info(f"▶️ 스케줄 재개: {user_id}")
            return True
        except Exception as e:
            logger.error(f"❌ 재개 실패: {e}")
            return False


def send_scheduled_briefing(job_data: Dict):
    """
    스케줄된 브리핑 발송 함수
    
    Args:
        job_data: 작업 데이터 딕셔너리
    """
    from app import search_naver, search_google, create_excel, send_email
    
    user_id = job_data['user_id']
    email = job_data['email']
    keywords = job_data['keywords']
    max_results = job_data.get('max_results', 10)
    engines = job_data.get('engines', ['naver'])
    
    logger.info(f"📬 브리핑 발송 시작: {email} - 키워드: {keywords}")
    
    try:
        all_results = []
        
        # 각 키워드별로 검색
        for keyword in keywords:
            if "google" in engines:
                google_results = search_google(keyword, max_results)
                all_results.extend(google_results)
            
            if "naver" in engines:
                naver_results = search_naver(keyword, max_results)
                all_results.extend(naver_results)
        
        if not all_results:
            logger.warning(f"⚠️ 검색 결과 없음: {keywords}")
            return
        
        # Excel 생성
        excel_content = create_excel(all_results)
        
        # 키워드 문자열 생성
        keyword_str = ', '.join(keywords)
        
        # 이메일 발송
        send_email(email, keyword_str, excel_content, len(all_results))
        
        logger.info(f"✅ 브리핑 발송 완료: {email} - {len(all_results)}개 결과")
        
        # TODO: 크레딧 차감 (Firebase 연동 필요)
        # deduct_credits(user_id, credits=3)
        
    except Exception as e:
        logger.error(f"❌ 브리핑 발송 실패: {e}")
        # TODO: 실패 알림 발송


# 싱글톤 인스턴스
scheduler_manager = SchedulerManager()

