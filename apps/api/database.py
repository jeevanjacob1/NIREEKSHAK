import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/trustus_db"
)

# Set connect_timeout to fail fast if PostgreSQL is not running yet
try:
    engine = create_engine(
        DATABASE_URL, 
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception:
    engine = None
    SessionLocal = None

Base = declarative_base()

def get_db():
    """Dependency for acquiring database session with graceful error handling."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
