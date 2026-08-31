from sqlalchemy import Column, String, Float, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True)
    state = Column(String(100), index=True)
    constituency = Column(String(100), index=True)
    mp_name = Column(String(150))
    sanctioned_amount = Column(Float, nullable=False)
    expenditure_amount = Column(Float, default=0.0)
    status = Column(String(50), default="Sanctioned")
    implementing_agency = Column(String(200), nullable=True)
    sanction_date = Column(String(50), nullable=True)
    completion_date = Column(String(50), nullable=True)

    risk_profile = relationship("ProjectRisk", back_populates="project", uselist=False)


class ProjectRisk(Base):
    __tablename__ = "project_risks"

    project_id = Column(String(64), ForeignKey("projects.id"), primary_key=True)
    risk_score = Column(Integer, nullable=False)  # 0 to 100
    risk_level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH
    signals = Column(JSON, default=list)  # List of signal dicts
    review_status = Column(String(50), default="UNREVIEWED")

    project = relationship("Project", back_populates="risk_profile")
