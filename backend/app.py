from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Resume(BaseModel):
    content: str

class ResumeAnalysis(BaseModel):
    response: str
    advice: str

@app.post("/api/analyze-resume", response_model=ResumeAnalysis)
async def analyze_resume(resume: Resume):
    try:
        # Query ChatGPT for resume analysis
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional resume reviewer. Provide a brief overall assessment of the resume and then list 3 pieces of advice for improvement."},
                {"role": "user", "content": f"Please analyze this resume:\n\n{resume.content}"}
            ]
        )
        # Extract the response from ChatGPT
        gpt_response = response.choices[0].message.content
        # Split the response into overall assessment and advice
        parts = gpt_response.split("\n\n", 1)
        overall_assessment = parts[0]
        advice = parts[1] if len(parts) > 1 else "No specific advice provided."
        return ResumeAnalysis(response=overall_assessment, advice=advice)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
