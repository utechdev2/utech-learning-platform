import { courses as fallbackCourses, type Course, type Lesson } from "@/data/courses";
import { createClient } from "@/lib/supabase/server";

type CourseRow = {
  id: string; slug: string; title: string; description: string; level: string; duration: string; published: boolean;
  status?: "live" | "coming_soon"; access_tier?: "free" | "premium"; lessons?: LessonRow[];
};
type LessonRow = {
  id: string; slug: string; title: string; summary: string; points: string[]; quiz_question: string;
  quiz_options: string[]; quiz_answer: number; position: number; published: boolean; content?: string;
  access_tier?: "free" | "premium";
};

export type Lab = {
  id: string;
  courseId: string;
  lessonSlug?: string | null;
  slug: string;
  title: string;
  summary: string;
  difficulty: string;
  estimatedMinutes: number;
  accessTier: "free" | "premium";
  status: "available" | "coming_soon";
  instructions: string;
  starterRepoUrl?: string | null;
};

function mapCourse(row: CourseRow): Course {
  const lessons = (row.lessons ?? [])
    .filter(lesson => lesson.published)
    .sort((a,b) => a.position - b.position)
    .map(lesson => ({
      slug: lesson.slug, title: lesson.title, summary: lesson.summary, content: lesson.content ?? "",
      points: lesson.points ?? [], accessTier: lesson.access_tier ?? "free",
      quiz: {
        question: lesson.quiz_question, options: lesson.quiz_options ?? [], answer: lesson.quiz_answer,
      },
    }));
  return {
    slug: row.slug, title: row.title, description: row.description, level: row.level, duration: row.duration, lessons,
    status: row.status ?? "live", accessTier: row.access_tier ?? "free",
  };
}

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("id,slug,title,description,level,duration,published,status,access_tier,lessons(id,slug,title,summary,content,points,quiz_question,quiz_options,quiz_answer,position,published,access_tier)")
      .eq("published", true)
      .order("slug");
    if (!error && data?.length) return (data as unknown as CourseRow[]).map(mapCourse);
  } catch {}
  return fallbackCourses;
}

export async function getCourseFromDb(slug: string): Promise<Course | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("id,slug,title,description,level,duration,published,status,access_tier,lessons(id,slug,title,summary,content,points,quiz_question,quiz_options,quiz_answer,position,published,access_tier)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!error && data) return mapCourse(data as unknown as CourseRow);
  } catch {}
  return fallbackCourses.find(course => course.slug === slug);
}

export async function getLab(courseSlug: string, labSlug: string): Promise<Lab | undefined> {
  const labs = await getLabs(courseSlug);
  return labs.find(lab => lab.slug === labSlug);
}

export async function getLabs(courseSlug?: string): Promise<Lab[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("labs")
      .select("id,course_id,lesson_slug,slug,title,summary,difficulty,estimated_minutes,access_tier,status,instructions,starter_repo_url,course:course_id(slug)")
      .in("status", ["available", "coming_soon"]);

    if (!error && data) {
      return (data as Array<Record<string, unknown>>).map(row => {
        const courseRelation = row.course;
        const courseSlugFromRow =
          Array.isArray(courseRelation)
            ? String((courseRelation[0] as Record<string, unknown> | undefined)?.slug ?? "")
            : String((courseRelation as Record<string, unknown> | null)?.slug ?? "");

        const accessTier: Lab["accessTier"] =
          row.access_tier === "premium" ? "premium" : "free";
        const status: Lab["status"] =
          row.status === "available" ? "available" : "coming_soon";

        return {
          id: String(row.id),
          courseId: String(row.course_id),
          lessonSlug: row.lesson_slug ? String(row.lesson_slug) : null,
          slug: String(row.slug),
          title: String(row.title),
          summary: String(row.summary),
          difficulty: String(row.difficulty),
          estimatedMinutes: Number(row.estimated_minutes),
          accessTier,
          status,
          instructions: String(row.instructions ?? ""),
          starterRepoUrl: row.starter_repo_url ? String(row.starter_repo_url) : null,
          courseSlugFromRow,
        };
      }).filter(lab => !courseSlug || lab.courseSlugFromRow === courseSlug)
        .map(({ courseSlugFromRow: _courseSlugFromRow, ...lab }) => lab);
    }
  } catch {}
  return [];
}
