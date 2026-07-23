const API = process.env.NEXT_PUBLIC_API_URL!;

export async function getSpeech(text: string, language: string) {
  const response = await fetch(`${API}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error("Speech generation failed");
  }

  const data = await response.json();

  return data.audio_url as string;
}
