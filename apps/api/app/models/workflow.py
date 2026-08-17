from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ToolModel(BaseModel):
    id: str
    name: str
    category: str
    description: str
    pricingModel: str = Field(..., alias="pricing_model", description="Free, Freemium, or Paid")
    pricingDetails: str = Field(..., alias="pricing_details")
    skillLevel: str = Field(..., alias="skill_level", description="Beginner, Intermediate, or Advanced")
    websiteUrl: str = Field(..., alias="website_url")
    affiliateUrl: Optional[str] = Field(None, alias="affiliate_url")
    whyRecommended: str = Field(..., alias="why_recommended")
    rating: float = 4.8
    logoText: str = Field(..., alias="logo_text")
    badge: Optional[str] = None
    keyFeatures: List[str] = Field(default_factory=list, alias="key_features")

class PromptVariableModel(BaseModel):
    key: str
    label: str
    defaultValue: str
    placeholder: str
    options: Optional[List[str]] = None

class PromptTemplateModel(BaseModel):
    id: str
    title: str
    targetTool: str
    stepNumber: int
    rawTemplate: str
    variables: List[PromptVariableModel] = Field(default_factory=list)
    explanation: str
    bestPractices: List[str] = Field(default_factory=list)

class WorkflowStepModel(BaseModel):
    stepNumber: int
    title: str
    description: str
    category: str
    primaryTool: ToolModel
    alternativeTools: List[ToolModel] = Field(default_factory=list)
    prompt: PromptTemplateModel
    estimatedTime: str
    proTip: str

class ClarificationAssumptionModel(BaseModel):
    id: str
    category: str
    label: str
    currentValue: str
    options: List[str]

class WorkflowResponseModel(BaseModel):
    id: str
    goal: str
    category: str
    summary: str
    difficulty: str
    totalTime: str
    triageAssumptions: List[ClarificationAssumptionModel] = Field(default_factory=list)
    steps: List[WorkflowStepModel]

class WorkflowGenerateRequest(BaseModel):
    goal: str
    assumptions: Optional[Dict[str, str]] = None
