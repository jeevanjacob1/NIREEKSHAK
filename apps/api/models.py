from sqlalchemy import Column, String, Float, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"
    # Changed 'id' to 'project_id' to match frontend
    project_id = Column(String(64), primary_key=True, index=True)
    # Changed 'title' to 'project_name'
    project_name = Column(String(255), nullable=False)
    state = Column(String(100), index=True)
    constituency = Column(String(100), index=True)
    category = Column(String(100), index=True)
    # Changed 'sanctioned_amount' to 'amount'
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="Unsanctioned")
    # Added recommendation_date
    recommendation_date = Column(String(20), nullable=True) 
    risk_profile = relationship("ProjectRisk", back_populates="project", uselist=False)

class ProjectRisk(Base):
    __tablename__ = "project_risks"
    project_id = Column(String(64), ForeignKey("projects.project_id"), primary_key=True)
    risk_score = Column(Integer, nullable=True) 
    risk_level = Column(String(20), nullable=True) 
    signals = Column(JSON, default=list) 
    project = relationship("Project", back_populates="risk_profile")