#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';

interface HookInput {
    session_id: string;
    transcript_path?: string;
    cwd: string;
    hook_type?: string;
    tool_name?: string;
    tool_input?: Record<string, unknown>;
    tool_output?: string;
    prompt?: string;
}

// ASCII 치어리더 아트 컬렉션
const ASCII_CHEERLEADERS = {
    welcome: [
        String.raw`
   \(^o^)/   오늘도 화이팅!
    /|\      같이 열심히 해보자!
    / \
        `,
        String.raw`
    *
   \(>v<)/   Let's go!!!
    /|\      오늘도 멋진 하루!
    / \
        `,
        String.raw`
    ~
   \(^_^)/   새로운 시작이야!
    /|\      화이팅~!
    / \
        `
    ],
    preCompact: [
        String.raw`
   \(^_^)/   잠깐! 머리 정리중...
    /|\      넌 정말 잘하고 있어!
    / \      곧 돌아올게!
        `,
        String.raw`
    (>_<)b   컨텍스트 정리하고 올게~
    /|\      지금까지 수고했어!
    / \
        `,
        String.raw`
   \(o_o)/   휴식도 실력이야!
    /|\      잠깐 쉬고 더 잘해보자!
    / \
        `
    ],
    errorRecovery: [
        String.raw`
   \(>_<)/   에러? 괜찮아!
    /|\      버그는 성장의 기회야!
    / \      다시 해보자!
        `,
        String.raw`
   \(O_O)/   오류 발생!
    /|\      하지만 걱정마~
    / \      같이 고쳐보자!
        `,
        String.raw`
   (^_^)b    실패는 성공의 어머니!
    /|\      디버깅 타임~
    / \
        `
    ],
    success: [
        String.raw`
   \(*v*)/   성공! 대단해!
    /|\      역시 천재!
    / \
        `,
        String.raw`
    * * *
   \(^o^)/   Perfect! 잘했어!
    /|\
    / \
        `,
        String.raw`
   \(^_^)/   빌드 성공!
    /|\      이 기세 그대로!
    / \
        `
    ]
};

// 격려 메시지 컬렉션
const MESSAGES = {
    welcome: [
        "새로운 세션 시작! 오늘도 멋진 코드 만들어보자!",
        "다시 만나서 반가워! 어디까지 했더라?",
        "자, 시작해볼까? 오늘도 화이팅!",
        "Ready? 같이 문제 해결해보자!"
    ],
    preCompact: [
        "컨텍스트 정리할게. 잠시 후 더 가벼운 마음으로 돌아올게!",
        "지금까지 정말 열심히 했어! 잠깐 쉬고 가자~",
        "머리 식히고 올게! 넌 최고야!",
        "정리하고 올게~ 다음엔 더 빠르게!"
    ],
    errorKeywords: {
        "error": "에러 났어도 괜찮아! 차근차근 해결해보자!",
        "fail": "실패는 성공으로 가는 길이야!",
        "exception": "예외 상황이네~ 같이 분석해보자!",
        "undefined": "undefined 찾았다! 원인 분석 고고!",
        "cannot": "할 수 없다고? 방법을 찾아보자!",
        "not found": "못 찾았어도 괜찮아! 다른 방법이 있을 거야!"
    },
    buildSuccess: [
        "빌드 성공! 역시 최고! 🎉",
        "테스트 통과! 대단해!",
        "깔끔하게 완료! 이 기세로!"
    ]
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function formatOutput(ascii: string, message: string, type: string): string {
    const border = '━'.repeat(45);
    const typeEmoji = {
        welcome: '🌟',
        preCompact: '💫',
        errorRecovery: '💪',
        success: '🎉'
    }[type] || '✨';

    return `
${border}
${typeEmoji} DEV CHEERLEADER ${typeEmoji}
${border}
${ascii}
📣 ${message}
${border}
`;
}

function detectError(output: string): string | null {
    const lowerOutput = output.toLowerCase();
    for (const [keyword, message] of Object.entries(MESSAGES.errorKeywords)) {
        if (lowerOutput.includes(keyword)) {
            return message;
        }
    }
    return null;
}

function detectSuccess(output: string): boolean {
    const successKeywords = ['success', 'passed', 'ok', 'done', 'complete', 'built'];
    const lowerOutput = output.toLowerCase();
    return successKeywords.some(kw => lowerOutput.includes(kw));
}

async function main() {
    try {
        const input = readFileSync(0, 'utf-8');
        const data: HookInput = JSON.parse(input);
        
        const hookType = process.env.CHEERLEADER_HOOK_TYPE || 'welcome';
        
        let output = '';
        
        switch (hookType) {
            case 'session_start':
                output = formatOutput(
                    getRandomItem(ASCII_CHEERLEADERS.welcome),
                    getRandomItem(MESSAGES.welcome),
                    'welcome'
                );
                break;
                
            case 'pre_compact':
                output = formatOutput(
                    getRandomItem(ASCII_CHEERLEADERS.preCompact),
                    getRandomItem(MESSAGES.preCompact),
                    'preCompact'
                );
                break;
                
            case 'post_tool_use':
                const toolOutput = data.tool_output || '';
                
                // 에러 감지
                const errorMsg = detectError(toolOutput);
                if (errorMsg) {
                    output = formatOutput(
                        getRandomItem(ASCII_CHEERLEADERS.errorRecovery),
                        errorMsg,
                        'errorRecovery'
                    );
                    break;
                }
                
                // 성공 감지
                if (detectSuccess(toolOutput)) {
                    output = formatOutput(
                        getRandomItem(ASCII_CHEERLEADERS.success),
                        getRandomItem(MESSAGES.buildSuccess),
                        'success'
                    );
                    break;
                }
                
                // 그 외에는 출력 없음
                break;
                
            default:
                break;
        }
        
        if (output) {
            console.log(output);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Cheerleader hook error:', err);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
});
