import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// 바탕화면 경로 가져오기
function getDesktopPath(): string {
  try {
    const desktopPath = execSync(
      'powershell -Command "[Environment]::GetFolderPath(\'Desktop\')"',
      { encoding: 'utf-8' }
    ).trim();
    return desktopPath;
  } catch (error) {
    // 실패 시 기본 경로
    const { homedir } = require('os');
    return path.join(homedir(), 'Desktop');
  }
}

// 프로젝트 폴더의 엑셀 파일 찾기
const projectDir = process.cwd();
const excelFiles = fs.readdirSync(projectDir).filter(file => 
  file.startsWith('WorkFree_사업계획서') && file.endsWith('.xlsx')
);

if (excelFiles.length === 0) {
  console.log('❌ 엑셀 파일을 찾을 수 없습니다.');
  process.exit(1);
}

const sourceFile = path.join(projectDir, excelFiles[0]);
const desktopPath = getDesktopPath();
const destFile = path.join(desktopPath, excelFiles[0]);

// 바탕화면 디렉토리 확인
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
}

// 파일 복사
fs.copyFileSync(sourceFile, destFile);

console.log(`\n✅ 바탕화면에 저장 완료!`);
console.log(`📁 위치: ${destFile}`);
console.log(`\n💡 파일 탐색기로 열어드릴까요?`);

// 파일 탐색기로 열기
try {
  execSync(`explorer.exe "${desktopPath}"`);
  console.log(`\n📂 파일 탐색기가 열렸습니다.`);
} catch (error) {
  console.log(`\n⚠️ 파일 탐색기를 열 수 없습니다. 수동으로 확인해주세요.`);
}

