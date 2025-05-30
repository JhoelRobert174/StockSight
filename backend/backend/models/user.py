from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base  # pastikan import dari models/__init__.py

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(150), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False) 
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    store_name = Column(String(128), nullable=False, default='StockSight')
    kategoris = relationship("Kategori", back_populates="user", cascade="all, delete-orphan")
    produks = relationship("Produk", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"

