from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://prescription-frontend-mu.vercel.app",
            "https://prescribeai.vercel.app/",
            "http://localhost:5173",  # Local development
            "*" # Keep for now to avoid blocking
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
