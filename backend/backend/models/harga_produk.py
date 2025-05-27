from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from . import Base

class HargaProduk(Base):
    __tablename__ = 'harga_produk'

    id = Column(Integer, primary_key=True)
    produk_id = Column(Integer, ForeignKey('produk.id'), nullable=False)
    harga = Column(Float, nullable=False)
    tanggal = Column(DateTime, server_default=func.now(), nullable=False)

    produk = relationship("Produk", back_populates="harga_histories")
