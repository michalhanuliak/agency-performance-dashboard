import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.database import Base, SessionLocal, engine
from app.models import Widget
from app.routers import dashboard, incidents, stats

logger = logging.getLogger("api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

Base.metadata.create_all(bind=engine)

DEFAULT_WIDGETS = [
    {"widget_id": "avg-response", "col_span": 1, "visible": True},
    {"widget_id": "avg-call-answer", "col_span": 1, "visible": True},
    {"widget_id": "total-incidents", "col_span": 1, "visible": True},
    {"widget_id": "critical-incidents", "col_span": 1, "visible": True},
    {"widget_id": "response-by-type", "col_span": 2, "visible": True},
    {"widget_id": "severity-breakdown", "col_span": 2, "visible": True},
    {"widget_id": "recent-incidents", "col_span": 1, "visible": True},
    {"widget_id": "incidents-over-time", "col_span": 2, "visible": True},
    {"widget_id": "incidents-table", "col_span": 4, "visible": True},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        if not db.query(Widget).first():
            for position, w in enumerate(DEFAULT_WIDGETS):
                db.add(Widget(**w, position=position))
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="Agency Performance Dashboard API", lifespan=lifespan)

allowed_origins = [
    o.strip().rstrip("/") for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request logging middleware ---


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info("%s %s %d %.1fms", request.method, request.url.path, response.status_code, duration_ms)
    return response


# --- Custom error handlers ---


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation error",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )


app.include_router(incidents.router)
app.include_router(stats.router)
app.include_router(dashboard.router)
