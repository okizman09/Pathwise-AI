from fastapi import APIRouter, HTTPException
from app.models.workflow import WorkflowGenerateRequest, WorkflowResponseModel
from app.services.ai_service import ai_service

router = APIRouter(prefix="/workflows", tags=["Workflows"])

@router.post("/generate")
async def generate_workflow(request: WorkflowGenerateRequest):
    """
    Generates a personalized AI tool workflow and editable prompt templates using Google Gemini API.
    """
    if not request.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty.")
    
    result = await ai_service.generate_workflow(request.goal, request.assumptions)
    return result
