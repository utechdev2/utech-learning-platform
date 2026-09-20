export type LabRuntime = "python" | "clangpp" | "sqlite";

type ExecutionResult = {
  resultType?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  tty?: string;
};

export type LabCheck = {
  label: string;
  passed: boolean;
  detail: string;
};

export type LabAssessment = {
  score: number;
  passed: boolean;
  checks: LabCheck[];
};

const normalize = (value: string) => value.replace(/\r/g, "").trim();

export function assessLab(
  labId: string,
  code: string,
  runs: ExecutionResult[],
): LabAssessment {
  const successful = runs.filter((run) => run.resultType === "complete");
  const output = successful.map((run) => normalize(run.stdout ?? run.tty ?? "")).join("\n");
  const source = code.replace(/\r/g, "");

  if (labId === "python-function-lab") {
    const [first, second] = successful;
    const firstOutput = normalize(first?.stdout ?? first?.tty ?? "");
    const secondOutput = normalize(second?.stdout ?? second?.tty ?? "");

    const checks: LabCheck[] = [
      {
        label: "Defines a reusable greet(name) function",
        passed: /def\s+greet\s*\(\s*name\s*\)\s*:/.test(source),
        detail: "The greeting logic should live inside greet(name).",
      },
      {
        label: "Reads the learner's name with input()",
        passed: /\binput\s*\(/.test(source),
        detail: "The program should ask the user for a name.",
      },
      {
        label: "Runs successfully for Oscar",
        passed: Boolean(first && first.resultType === "complete" && /Hello,\s*Oscar/i.test(firstOutput)),
        detail: first?.stderr ? first.stderr.trim() : "Expected a personalized greeting for Oscar.",
      },
      {
        label: "Runs successfully for Ama",
        passed: Boolean(second && second.resultType === "complete" && /Hello,\s*Ama/i.test(secondOutput)),
        detail: second?.stderr ? second.stderr.trim() : "Expected a personalized greeting for Ama.",
      },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return { score: Math.round((passedCount / checks.length) * 100), passed: passedCount === checks.length, checks };
  }

  if (labId === "cpp-coding-lab") {
    const first = successful[0];
    const validationRun = successful[1];
    const firstOutput = normalize(first?.stdout ?? first?.tty ?? "");
    const validationOutput = normalize(validationRun?.stdout ?? validationRun?.tty ?? "");

    const checks: LabCheck[] = [
      {
        label: "Reads five scores from user input",
        passed: /\bcin\s*>>/.test(source) && /for\s*\([^)]*<\s*5/.test(source),
        detail: "The program must collect five scores instead of hard-coding them.",
      },
      {
        label: "Validates scores from 0 to 100",
        passed: /score\s*<\s*0\s*\|\|\s*score\s*>\s*100/.test(source) && /while\s*\(/.test(source),
        detail: "An invalid score must be rejected and the user must be asked again.",
      },
      {
        label: "Uses custom functions",
        passed: /double\s+calculateAverage\s*\(/.test(source) && /char\s+getLetterGrade\s*\(/.test(source),
        detail: "Move the average and grade logic into reusable functions.",
      },
      {
        label: "Calculates the average from the vector",
        passed: /vector\s*<\s*int\s*>/.test(source) && /total\s*\+=\s*score/.test(source) && /calculateAverage\s*\(\s*scores\s*\)/.test(source),
        detail: "The calculation should use the values collected in the vector.",
      },
      {
        label: "Prints the numerical average and letter grade",
        passed: /Average\s*:/.test(firstOutput) && /Grade\s*:\s*[ABCDF]/i.test(firstOutput),
        detail: "The final output should show both the average and a letter grade.",
      },
      {
        label: "Handles valid and invalid input correctly",
        passed: Boolean(first?.resultType === "complete" && first.exitCode === 0 && /Average\s*:\s*80(?:\.00)?/i.test(firstOutput) && /Grade\s*:\s*B/i.test(firstOutput) && validationRun?.resultType === "complete" && /Invalid score/i.test(validationOutput) && /Average\s*:\s*80(?:\.00)?/i.test(validationOutput)),
        detail: validationRun?.stderr ? validationRun.stderr.trim() : "The grader tests a normal five-score run and an out-of-range score that must be rejected.",
      },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return { score: Math.round((passedCount / checks.length) * 100), passed: passedCount === checks.length, checks };
  }
  if (labId === "sql-database-lab") {
    const checks: LabCheck[] = [
      {
        label: "Creates the students table",
        passed: /create\s+table\s+(?:if\s+not\s+exists\s+)?students/i.test(source),
        detail: "Create a table named students.",
      },
      {
        label: "Inserts student records",
        passed: /insert\s+into\s+students/i.test(source),
        detail: "Insert at least three student records.",
      },
      {
        label: "Sorts the result by age",
        passed: /order\s+by\s+age/i.test(source),
        detail: "The final query should sort students by age.",
      },
      {
        label: "SQL executes successfully and returns rows",
        passed: successful.length > 0 && output.length > 0 && !/error|no such table|syntax error/i.test(output),
        detail: successful.length ? "The database query produced output." : "The SQL runtime did not complete successfully.",
      },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return { score: Math.round((passedCount / checks.length) * 100), passed: passedCount === checks.length, checks };
  }

  return {
    score: 0,
    passed: false,
    checks: [{ label: "Lab assessment", passed: false, detail: "Automated assessment is not configured for this lab yet." }],
  };
}
