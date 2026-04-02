import os
from typing import Annotated, TypedDict, List
from dotenv import load_dotenv

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from langgraph.graph import StateGraph, END

from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]


llm = ChatGroq(
    temperature=0.3, 
    model_name="llama-3.1-8b-instant", 
    groq_api_key=os.getenv("GROQ_API_KEY")
)

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], "The chat history"]
    user_data: dict
    username: str
    next_node: str

async def search_db_node(state: AgentState):
    username = state["username"]
    user_doc = await db.users.find_one({"leetcodeUsername": username})
    
    if user_doc and "leetcodeStats" in user_doc:
        return {"user_data": user_doc["leetcodeStats"]}
    
    return {"user_data": {"error": "Stats not found"}}


async def supervisor_node(state: AgentState):
    history = [m.content.lower() for m in state["messages"]]
    last_message = history[-1]
    
    if any(word in last_message for word in ["interview", "mock", "test", "question"]):
        return {"next_node": "interview_agent"}
    elif any(word in last_message for word in ["revise", "revision", "plan", "roadmap", "guide"]):
        return {"next_node": "revision_agent"}
    
   
    for msg in reversed(history[:-1]):
        if "interview" in msg: return {"next_node": "interview_agent"}
        if "revision" in msg: return {"next_node": "revision_agent"}
        
    return {"next_node": "interview_agent"}


async def interview_node(state: AgentState):
    stats = state["user_data"]
    context = f"Total: {stats.get('totalSolved')}, Mediums: {stats.get('medium')}"
    
    system_prompt = SystemMessage(content=f"""
        You are 'LeetX Mentor'. Your tone is professional and surgical.
        USER DATA: {context}
        
        FORMATTING RULES:
        - Use **Bold** for topics.
        - Use `inline code` for variables.
        - Keep responses under 150 words.
        
        INSTRUCTIONS:
        1. Acknowledge their {stats.get('medium')} Medium solves. 
        2. Ask ONE technical DSA question (BST, Arrays, or DP).
        3. If evaluating an answer: Provide a "Score: X/10" and a short hint for optimization.
        4. Focus on logic and patterns 
    """)
    
    response = await llm.ainvoke([system_prompt] + state["messages"])
    return {"messages": [response]}


async def revision_node(state: AgentState):
    stats = state["user_data"]
    recent = [p.get('title') for p in stats.get('recentProblems', [])[:3]]
    
    system_prompt = SystemMessage(content=f"""
        You are 'LeetX Coach'. 
        CONTEXT: Recent solves include {', '.join(recent)}.
        
        STRICT FORMATTING:
        - Use Emojis for headers.
        - Use `code blocks` for problem names.
        - NO long paragraphs.

        OUTPUT TEMPLATE:
        🚀 **3-DAY PLACEMENT SPRINT**
        
        📅 **Day 1: Concept**
        Focus on `Topic Related to {recent[0] if recent else 'DSA'}`.
        
        📅 **Day 2: Implementation**
        Solve `Similar Medium Problem`. 
        
        📅 **Day 3: Optimization**
        Optimize your `Time/Space Complexity`.

        💡 **PRO-TIP**
        Recruiters at companies look for **Dry Run** skills. Practice explaining logic line-by-line!
    """)
    
    response = await llm.ainvoke([system_prompt] + state["messages"])
    return {"messages": [response]}


builder = StateGraph(AgentState)

builder.add_node("search_db", search_db_node)
builder.add_node("supervisor", supervisor_node)
builder.add_node("interview_agent", interview_node)
builder.add_node("revision_agent", revision_node)

builder.set_entry_point("search_db")
builder.add_edge("search_db", "supervisor")

builder.add_conditional_edges(
    "supervisor",
    lambda x: x["next_node"],
    {
        "interview_agent": "interview_agent",
        "revision_agent": "revision_agent"
    }
)

builder.add_edge("interview_agent", END)
builder.add_edge("revision_agent", END)

leetX_brain = builder.compile()


@app.post("/chat")
async def chat_endpoint(payload: dict, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header missing")

    query = payload.get("query")
    history = payload.get("history", [])
    

    formatted_messages = []
    for msg in history:
        if msg['role'] == 'user':
            formatted_messages.append(HumanMessage(content=msg['content']))
        else:
            formatted_messages.append(SystemMessage(content=msg['content']))
            
    formatted_messages.append(HumanMessage(content=query))

    inputs = {
        "messages": formatted_messages,
        "username": x_user_id
    }
    
    final_state = await leetX_brain.ainvoke(inputs)
    return {"response": final_state["messages"][-1].content}