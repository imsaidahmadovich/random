import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FeedbackRequest {
  type: 'analyze_performance' | 'generate_questions' | 'explain_topic';
  examType: 'sat' | 'ielts' | 'olympiad';
  data: {
    answers?: Record<string, { selected: string; correct: boolean; skill: string }>;
    score?: number;
    weakAreas?: string[];
    topic?: string;
    difficulty?: string;
    count?: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, examType, data }: FeedbackRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case 'analyze_performance':
        systemPrompt = `You are an expert ${examType.toUpperCase()} tutor and test prep specialist. Analyze student performance and provide actionable feedback.`;
        userPrompt = `Analyze this student's test performance:

Score: ${data.score}%
Exam Type: ${examType.toUpperCase()}

Answer breakdown by skill:
${JSON.stringify(data.answers, null, 2)}

Provide a detailed analysis including:
1. Overall performance assessment
2. Specific weak areas that need improvement
3. Strong areas to maintain
4. Personalized study recommendations
5. Specific question types to focus on

Format your response as JSON with these fields:
{
  "overallAnalysis": "string",
  "weakPoints": ["array of weak areas"],
  "strongPoints": ["array of strong areas"],
  "recommendations": ["array of specific recommendations"],
  "priorityTopics": ["topics to study first"]
}`;
        break;

      case 'generate_questions':
        systemPrompt = `You are an expert ${examType.toUpperCase()} question creator. Generate high-quality practice questions similar to official exam questions.`;
        userPrompt = `Generate ${data.count || 5} practice questions for ${examType.toUpperCase()} exam.

Topic/Skill: ${data.topic}
Difficulty: ${data.difficulty || 'medium'}
${data.weakAreas ? `Focus on these weak areas: ${data.weakAreas.join(', ')}` : ''}

For each question, provide:
1. Question text
2. Four answer options (A, B, C, D)
3. Correct answer
4. Detailed explanation

Format your response as JSON array:
[{
  "question": "string",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctAnswer": "A/B/C/D",
  "explanation": "string",
  "skill": "string",
  "difficulty": "easy/medium/hard"
}]`;
        break;

      case 'explain_topic':
        systemPrompt = `You are a patient and thorough ${examType.toUpperCase()} tutor. Explain concepts clearly with examples.`;
        userPrompt = `Explain this topic for ${examType.toUpperCase()} preparation:

Topic: ${data.topic}

Provide:
1. Clear, concise explanation
2. Key concepts to remember
3. Common mistakes to avoid
4. 2-3 example problems with solutions
5. Tips for approaching this topic on the exam

Make the explanation suitable for a high school or college student preparing for the exam.`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    // Try to parse as JSON if the response should be JSON
    let parsedContent = content;
    if (type !== 'explain_topic') {
      try {
        // Find JSON in the response
        const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Keep as string if parsing fails
        parsedContent = content;
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("AI feedback error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
