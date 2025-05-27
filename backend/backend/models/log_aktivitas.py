from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .meta import Base

class LogAktivitas(Base):
    __tablename__ = 'log_aktivitas'
    id = Column(Integer, primary_key=True)
    waktu = Column(DateTime, default=datetime.utcnow)
    aksi = Column(String, nullable=False)
