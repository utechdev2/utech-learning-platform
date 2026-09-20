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
        passed: /def\\s+greet\\s*\\(\\s*name\\s*\\)\\s*:/.test(source),
        detail: "The greeting logic should live inside greet(name).",
      },
      {
        label: "Reads the learner's name with input()",
        passed: /\\binput\\s*\\(/.test(source),
        detail: "The program should ask the user for a name.",
      },
      {
        label: "Runs successfully for Oscar",
        passed: Boolean(first && first.resultType === "complete" && /Hello,\\s*Oscar/i.test(firstOutput)),
        detail: first?.stderr ? first.stderr.trim() : "Expected a personalized greeting for Oscar.",
      },
      {
        label: "Runs successfully for Ama",
        passed: Boolean(second && second.resultType === "complete" && /Hello,\\s*Ama/i.test(secondOutput)),
        detail: second?.stderr ? second.stderr.trim() : "Expected a personalized greeting for Ama.",
      },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return { score: Math.round((passedCount / checks.length) * 100), passed: passedCount === checks.length, checks };
  }

  if (labId === "cpp-coding-lab") {
    const run = successful[0];
    const averageMatch = output.match(/average\\s*:\\s*(-?\\d+(?:\\.\\d+)?)/i);
    const average = averageMatch ? Number(averageMatch[1]) : NaN;
    const checks: LabCheck[] = [
      {
        label: "Uses a vector for the scores",
        passed: /\\bvector\\s*<\\s*int\\s*>/.test(source) && /scores/.test(source),
        detail: "Keep the class scores in a vector.",
      },
      {
        label: "Uses a loop to calculate the total",
        passed: /\\bfor\\s*\\(/.test(source) && /total\\s*\\+=/.test(source),
        detail: "Calculate the total from the vector instead of hard-coding it.",
      },
      {
        label: "Calculates a decimal average",
        passed: /average/.test(source) && /(static_cast\\s*<\\s*double|double\\s+average)/.test(source),
        detail: "The average should be calculated as a decimal value.",
      },
      {
        label: "Program compiles and produces the expected average",
        passed: Boolean(run?.resultType === "complete" && run.exitCode === 0 && Math.abs(average - 80) < 0.001),
        detail: run?.stderr ? run.stderr.trim() : "Expected Average: 80 for the starter score set.",
      },
    ];

    const passedCount = checks.filter((check) => check.passed).length;
    return { score: Math.round((passedCount / checks.length) * 100), passed: passedCount === checks.length, checks };
  }

  if (labId === "sql-database-lab") {
    const checks: LabCheck[] = [
      {
        label: "Creates the students table",
        passed: /create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?students/i.test(source),
        detail: "Create a table named students.",
      },
      {
        label: "Inserts student records",
        passed: /insert\\s+into\\s+students/i.test(source),
        detail: "Insert at least three student records.",
      },
      {
        label: "Sorts the result by age",
        passed: /order\\s+by\\s+age/i.test(source),
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
