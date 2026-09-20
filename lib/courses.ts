import { courses as fallbackCourses, type Course, type Lesson } from "@/data/courses";
import { createClient } from "@/lib/supabase/server";

type CourseRow = {
  id: string; slug: string; title: string; description: string; level: string; duration: string; published: boolean;
  lessons?: LessonRow[];
};
type LessonRow = {
  id: string; slug: string; title: string; summary: string; points: string[]; quiz_question: string;
  quiz_options: string[]; quiz_answer: number; position: number; published: boolean; content?: string;
};

function mapCourse(row: CourseRow): Course {
  const lessons = (row.lessons ?? [])
    .sort((a,b) => a.position - b.position)
    .map(lesson => ({
      slug: lesson.slug, title: lesson.title, summary: lesson.summary, content: lesson.content ?? "",
      points: lesson.points ?? [], quiz: {
        question: lesson.quiz_question, options: lesson.quiz_options ?? [], answer: lesson.quiz_answer,
      },
    }));
  return { slug: row.slug, title: row.title, description: row.description, level: row.level, duration: row.duration, lessons };
}

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("courses").select("id,slug,title,description,level,duration,published,lessons(id,slug,title,summary,content,points,quiz_question,quiz_options,quiz_answer,position,published)").eq("published", true).order("slug");
    if (!error && data?.length) return (data as unknown as CourseRow[]).map(mapCourse);
  } catch {}
  return fallbackCourses;
}

export async function getCourseFromDb(slug: string): Promise<Course | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("courses").select("id,slug,title,description,level,duration,published,lessons(id,slug,title,summary,points,quiz_question,quiz_options,quiz_answer,position,published)").eq("slug", slug).eq("published", true).maybeSingle();
    if (!error && data) return mapCourse(data as unknown as CourseRow);
  } catch {}
  return fallbackCourses.find(course => course.slug === slug);
}
