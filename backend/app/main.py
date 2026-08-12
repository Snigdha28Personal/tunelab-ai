from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.datasets import router as datasets_router
from app.api.experiments import router as experiments_router
from app.api.evaluation import router as evaluation_router
from app.api.costs import router as costs_router
from app.api.decisions import router as decisions_router

app = FastAPI(
    title="TuneLab API — AI Fine-Tuning Experimentation Platform",
    description="Python ML evaluation engine for comparing baseline LLM prompts against fine-tuned models.",
    version="1.0.0"
)

# Enable CORS for local Next.js frontend and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(datasets_router)
app.include_router(experiments_router)
app.include_router(evaluation_router)
app.include_router(costs_router)
app.include_router(decisions_router)


@app.get("/")
def root():
    return {
        "app": "TuneLab API",
        "status": "online",
        "mode": "Python ML Backend Engine",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
