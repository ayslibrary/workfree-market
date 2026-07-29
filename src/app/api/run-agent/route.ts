import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function POST() {
  try {
    const scriptPath = path.join(
      process.cwd(),
      "public",
      "automation_agent",
      "setup_pilot.py"
    );

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { success: false, message: "에이전트 스크립트 파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return new Promise((resolve) => {
      exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("Agent execution error:", error);
          resolve(
            NextResponse.json({
              success: false,
              message: `에이전트 실행 오류: ${error.message}`,
              logs: stderr || error.message,
            })
          );
        } else {
          resolve(
            NextResponse.json({
              success: true,
              message: "🎉 파일럿 에이전트가 성공적으로 구동되었습니다!",
              output: stdout,
              timestamp: new Date().toLocaleString("ko-KR"),
            })
          );
        }
      });
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
