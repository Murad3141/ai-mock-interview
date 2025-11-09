import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, role, level, techstack, amount, userId } = body;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return Response.json(
        { success: false, error: "userId dəyəri düzgün təmin edilməyib." }, 
        { status: 400 }
      );
    }

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return ONLY the questions, without any additional text.
The questions must be formatted EXACTLY as a JSON array of strings:
["Question 1", "Question 2", "Question 3"]
Do not use any special characters like "/" or "*" that might confuse a voice assistant.`,
    });

    let cleanedQuestions = questions;

    if (cleanedQuestions.startsWith('```json')) {
        cleanedQuestions = cleanedQuestions.substring(7);
    }
    if (cleanedQuestions.endsWith('```')) {
        cleanedQuestions = cleanedQuestions.substring(0, cleanedQuestions.length - 3);
    }
    cleanedQuestions = cleanedQuestions.trim();

    let parsedQuestions: any[];
    
    try {
        parsedQuestions = JSON.parse(cleanedQuestions);
    } catch (e: any) {
        console.error("JSON Parse Xətası:", cleanedQuestions, e);
        return Response.json(
            { 
              success: false, 
              error: "AI cavabı təmizlənmədən sonra belə düzgün JSON formatında deyil.",
              details: `AI-dan gələn son mətn: ${cleanedQuestions.substring(0, 150)}...`,
              parseError: e.message
            }, 
            { status: 500 }
        );
    }

    const interview = {
      userId: userId,
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("users")
      .doc(userId)
      .collection("interviews")
      .add(interview);

    revalidatePath('/');

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Ümumi Server/Admin SDK Xətası:", error);
    
    const errorMessage = error.message || "Bilinməyən server xətası baş verdi. Vercel-də Admin/Gemini açarlarını yoxlayın.";
    
    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { userId } = Object.fromEntries(new URL(request.url).searchParams);

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return Response.json(
      { success: false, error: "GET sorğusu üçün düzgün userId query parametri tələb olunur." },
      { status: 400 }
    );
  }

  try {
    const snapshot = await db.collection("users")
      .doc(userId)
      .collection("interviews")
      .get();

    const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return Response.json({ success: true, data: interviews }, { status: 200 });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message || "Bilinməyən məlumat çəkmə xətası." }, { status: 500 });
  }
}