from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .meta import Base
from sqlalchemy.sql import func
from .user import User  # ← Ini yang kumaksudkan

class LogAktivitas(Base):
    __tablename__ = 'log_aktivitas'

    id = Column(Integer, primary_key=True)
    waktu = Column(DateTime(timezone=True), server_default=func.now())
    aksi = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey('user.id'), nullable=True)  # ← Baru digunakan di dalam class
    user = relationship("User")
