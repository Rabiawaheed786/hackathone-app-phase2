from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, get_db
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# 1. Setup
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# 2. CORS Fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Schema
class ChatRequest(BaseModel):
    prompt: str

# 4. Database Functions (Tools)
def ai_add_task(title: str, description: str = "Added by AI Agent"):
    db = next(get_db())
    new_todo = models.Todo(title=title, description=description, is_completed=False)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return f"SUCCESS: Task '{title}' has been added to your list!"

def ai_list_tasks():
    db = next(get_db())
    tasks = db.query(models.Todo).all()
    if not tasks:
        return "Aapki list khali hai."
    return [{"title": t.title} for t in tasks]

# 5. Tools Definition for AI
tools = [
    {
        "type": "function",
        "function": {
            "name": "ai_add_task",
            "description": "Call this function whenever the user asks to add, create, or save a task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "The name of the task"},
                    "description": {"type": "string", "description": "Details about the task"}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "ai_list_tasks",
            "description": "Call this to show the user their current tasks."
        }
    }
]

# 6. AI Agent Logic (Main Endpoint)
@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        # System instruction AI ko tool use karne par majboor karti hai
        messages = [
            {"role": "system", "content": "You are a helpful Todo Assistant. When a user asks to add a task, you MUST call 'ai_add_task'. Don't just talk, take action."},
            {"role": "user", "content": request.prompt}
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        ai_msg = response.choices[0].message

        # Agar AI tool call kare
        if ai_msg.tool_calls:
            for tool_call in ai_msg.tool_calls:
                fn_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)

                if fn_name == "ai_add_task":
                    result = ai_add_task(args.get("title"), args.get("description", "AI Task"))
                    return {"ai_response": result}
                
                if fn_name == "ai_list_tasks":
                    result = ai_list_tasks()
                    return {"ai_response": f"Ye rahi aapki list: {result}"}

        # Agar tool call na ho toh normal reply
        return {"ai_response": ai_msg.content}

    except Exception as e:
        print(f"Error: {e}")
        return {"ai_response": "Sorry, AI logic mein koi masla aa gaya hai."}

# 7. List API for Frontend Dashboard
@app.get("/tasks")
def read_tasks(db: Session = Depends(get_db)):
    return db.query(models.Todo).all()