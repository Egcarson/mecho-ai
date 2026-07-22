from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("Gemini Key Now:", GEMINI_API_KEY)