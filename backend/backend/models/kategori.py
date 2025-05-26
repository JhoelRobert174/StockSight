from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from . import Base

class Kategori(Base):
    __tablename__ = 'kategori'

    id = Column(Integer, primary_key=True)
    nama = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    produk = relationship(
        "Produk",
        back_populates="kategori",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Kategori(nama='{self.nama}')>"
