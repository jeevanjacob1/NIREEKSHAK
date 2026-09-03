from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import projects, risks, analytics, investigation

app = FastAPI(
    title="TrustUs — MPLADS Intelligence API",
    description="Backend API powering anomaly detection, risk scoring, and evidence investigation for MPLADS projects.",
    version="1.0.0"
)

# Enable CORS for Next.js / React local and production ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register sub-routers
app.include_router(projects.router, prefix="/api")
app.include_router(risks.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(investigation.router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "system": "TrustUs Intelligence Core",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)