from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from summariser import TextSummarizer
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend (React usually runs on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class TextRequest(BaseModel):
    text: str
summariser = TextSummarizer()
@app.post("/summarise")
async def summ(req: TextRequest):
    summary = summariser.summarize(req.text)
    return {"summary": summary}
