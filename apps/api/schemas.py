from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Date, Text, Numeric, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class State(Base):
    __tablename__ = "states"
    state_id = Column(Integer, primary_key=True, autoincrement=True)
    state_name = Column(String(150), unique=True, nullable=False)

class Constituency(Base):
    __tablename__ = "constituencies"
    constituency_id = Column(Integer, primary_key=True, autoincrement=True)
    state_id = Column(Integer, ForeignKey("states.state_id"), nullable=False)
    constituency_name = Column(String(200), nullable=False)
    state = relationship("State")

class MP(Base):
    __tablename__ = "mps"
    mp_id = Column(Integer, primary_key=True, autoincrement=True)
    mp_name = Column(String(250), nullable=False)
    house = Column(String(50))
    constituency_id = Column(Integer, ForeignKey("constituencies.constituency_id"))
    constituency = relationship("Constituency")

class Project(Base):
    __tablename__ = "projects"
    
    project_id = Column(String(50), primary_key=True)
    mp_id = Column(Integer, ForeignKey("mps.mp_id"))
    constituency_id = Column(Integer, ForeignKey("constituencies.constituency_id"))
    state_id = Column(Integer, ForeignKey("states.state_id"))
    
    # Member 1 renamed this from project_name
    work_description = Column(Text)
    category = Column(String(250))
    city = Column(String(250))
    ward = Column(String(250))
    block = Column(String(250))
    village = Column(String(250))
    
    # Numeric types instead of float
    recommended_amount = Column(Numeric(15,2))
    allocated_amount = Column(Numeric(15,2))
    expenditure_amount = Column(Numeric(15,2))
    
    # Real PostgreSQL DATE types
    recommendation_date = Column(Date)
    approval_date = Column(Date)
    start_date = Column(Date)
    completion_date = Column(Date)
    
    # Renamed status fields
    project_status = Column(String(150))
    approval_status = Column(String(150))
    
    source_row_number = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # --- Relationships for easy querying ---
    state = relationship("State")
    constituency = relationship("Constituency")
    mp = relationship("MP")
    risk_profile = relationship("ProjectRisk", back_populates="project", uselist=False)

class ProjectRisk(Base):
    __tablename__ = "project_risks"
    project_id = Column(String(50), ForeignKey("projects.project_id"), primary_key=True)
    risk_score = Column(Integer, default=0)
    risk_level = Column(String(20), default="LOW")
    signals = Column(JSON, default=list)

    project = relationship("Project", back_populates="risk_profile")
