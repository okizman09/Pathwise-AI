from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.ai_service import ai_service

router = APIRouter(prefix="/tools", tags=["Tools"])

@router.get("")
def get_tools_directory() -> List[Dict[str, Any]]:
    """
    Returns the curated AI tools knowledge base directory.
    """
    return ai_service.tools_db

@router.get("/scrape")
async def scrape_trending_tools(category: str = "All") -> List[Dict[str, Any]]:
    """
    Scrapes and discovers live trending AI tools from web feeds & AI directory index.
    """
    return await ai_service.scrape_trending_tools(category)

