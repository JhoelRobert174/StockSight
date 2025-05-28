from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .user import User

from . import Base

class Kategori(Base):
    __tablename__ = 'kategori'
    __table_args__ = (
        UniqueConstraint('user_id', 'nama', name='uq_user_kategori_nama'),
    )
    id = Column(Integer, primary_key=True)
    nama = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    user = relationship("User", back_populates="kategoris")
    produk = relationship(
        "Produk",
        back_populates="kategori",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Kategori(nama='{self.nama}')>"
