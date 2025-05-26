from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from . import Base  # pastikan import dari models/__init__.py

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<User(username='{self.username}')>"
