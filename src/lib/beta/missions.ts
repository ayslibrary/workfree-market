import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  Mission,
  BetaTester,
  MissionCompletion,
  MissionProgress,
  MissionActionType,
} from '@/types/beta';
import { DEFAULT_MISSIONS, COMPLETION_BONUS, MAX_BETA_TESTERS } from '@/types/beta';

const MISSIONS_COLLECTION = 'beta_missions';
const TESTERS_COLLECTION = 'beta_testers';
const COMPLETIONS_COLLECTION = 'beta_mission_completions';

// 미션 초기 데이터 설정 (한 번만 실행)
export async function initializeMissions(): Promise<void> {
  const missionsRef = collection(db, MISSIONS_COLLECTION);
  const snapshot = await getDocs(missionsRef);

  if (snapshot.empty) {
    for (const mission of DEFAULT_MISSIONS) {
      await setDoc(doc(missionsRef), {
        ...mission,
        createdAt: Timestamp.now(),
      });
    }
  }
}

// 전체 미션 목록 가져오기
export async function getAllMissions(): Promise<Mission[]> {
  const q = query(
    collection(db, MISSIONS_COLLECTION),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Mission));
}

// 특정 미션 가져오기
export async function getMission(missionId: string): Promise<Mission | null> {
  const docRef = doc(db, MISSIONS_COLLECTION, missionId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Mission;
}

// 베타테스터 등록
export async function registerBetaTester(userId: string): Promise<number | null> {
  // 이미 등록되어 있는지 확인
  const existingTester = await getBetaTester(userId);
  if (existingTester) {
    return existingTester.betaNumber;
  }

  // 현재 베타테스터 수 확인
  const testersRef = collection(db, TESTERS_COLLECTION);
  const snapshot = await getDocs(testersRef);

  if (snapshot.size >= MAX_BETA_TESTERS) {
    return null; // 정원 초과
  }

  const betaNumber = snapshot.size + 1;

  // 베타테스터 등록
  await setDoc(doc(testersRef, userId), {
    userId,
    betaNumber,
    joinedAt: Timestamp.now(),
    totalCreditsEarned: 100, // 가입 보상
    timeSaved: 0,
    completedMissions: [],
    isCompleted: false,
    vipEligible: false,
  });

  // 첫 번째 미션 자동 완료 (회원가입)
  const missions = await getAllMissions();
  const signupMission = missions.find((m) => m.actionType === 'signup');
  if (signupMission) {
    await completeMission(userId, signupMission.id);
  }

  return betaNumber;
}

// 베타테스터 정보 가져오기
export async function getBetaTester(userId: string): Promise<BetaTester | null> {
  const docRef = doc(db, TESTERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as BetaTester;
}

// 현재 베타테스터 수 가져오기
export async function getBetaTesterCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, TESTERS_COLLECTION));
  return snapshot.size;
}

// 사용자의 미션 진행 상태 가져오기
export async function getUserMissionProgress(userId: string): Promise<MissionProgress[]> {
  const [missions, tester] = await Promise.all([
    getAllMissions(),
    getBetaTester(userId),
  ]);

  if (!tester) {
    return [];
  }

  return missions.map((mission) => {
    const isCompleted = tester.completedMissions.includes(mission.id);
    const previousMission = missions.find((m) => m.order === mission.order - 1);
    const isLocked =
      mission.order > 1 &&
      previousMission &&
      !tester.completedMissions.includes(previousMission.id);

    return {
      mission,
      isCompleted,
      isLocked,
    };
  });
}

// 미션 완료
export async function completeMission(
  userId: string,
  missionId: string,
  proof?: string
): Promise<void> {
  const [mission, tester] = await Promise.all([
    getMission(missionId),
    getBetaTester(userId),
  ]);

  if (!mission || !tester) {
    throw new Error('미션 또는 사용자를 찾을 수 없습니다.');
  }

  // 이미 완료한 미션인지 확인
  if (tester.completedMissions.includes(missionId)) {
    return;
  }

  // 미션 완료 기록 저장
  const completionRef = doc(collection(db, COMPLETIONS_COLLECTION));
  await setDoc(completionRef, {
    userId,
    missionId,
    completedAt: Timestamp.now(),
    creditsAwarded: mission.rewardCredits,
    proof: proof || null,
  });

  // 베타테스터 정보 업데이트
  const testerRef = doc(db, TESTERS_COLLECTION, userId);
  const newCompletedMissions = [...tester.completedMissions, missionId];
  const allMissions = await getAllMissions();
  const isAllCompleted = newCompletedMissions.length === allMissions.length;

  await updateDoc(testerRef, {
    completedMissions: arrayUnion(missionId),
    totalCreditsEarned: increment(mission.rewardCredits),
    timeSaved: increment(mission.timeSaved),
    isCompleted: isAllCompleted,
    vipEligible: isAllCompleted,
  });

  // 모든 미션 완료 시 완주 보너스 지급
  if (isAllCompleted) {
    await updateDoc(testerRef, {
      totalCreditsEarned: increment(COMPLETION_BONUS.credits),
    });
  }
}

// 액션 타입으로 미션 완료 (자동 감지용)
export async function completeMissionByAction(
  userId: string,
  actionType: MissionActionType,
  proof?: string
): Promise<void> {
  const missions = await getAllMissions();
  const mission = missions.find((m) => m.actionType === actionType);

  if (mission) {
    await completeMission(userId, mission.id, proof);
  }
}

// 사용자의 완료한 미션 목록
export async function getUserCompletedMissions(
  userId: string
): Promise<MissionCompletion[]> {
  const q = query(
    collection(db, COMPLETIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as MissionCompletion));
}

// 베타 완료율 계산
export async function getBetaCompletionRate(userId: string): Promise<number> {
  const tester = await getBetaTester(userId);
  if (!tester) return 0;

  const allMissions = await getAllMissions();
  return Math.round((tester.completedMissions.length / allMissions.length) * 100);
}

// 시간 포맷팅 (분 → "X시간 Y분")
export function formatTimeSaved(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}분`;
  } else if (mins === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${mins}분`;
  }
}

