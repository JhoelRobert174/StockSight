from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Numeric, UniqueConstraint
from sqlalchemy.orm import relationship
from . import Base
from .harga_produk import HargaProduk

class Produk(Base):
    __tablename__ = 'produk'
    __table_args__ = (
        UniqueConstraint('user_id', 'nama', name='uq_user_produk_nama'),
    )

    id = Column(Integer, primary_key=True)
    nama = Column(String(255), nullable=False)
    stok = Column(Integer, default=0)
    harga = Column(Numeric(12, 2), nullable=False)

    kategori_id = Column(Integer, ForeignKey('kategori.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    kategori = relationship("Kategori", back_populates="produk")
    user = relationship("User", back_populates="produks")
    harga_histories = relationship(
        "HargaProduk",
        back_populates="produk",
        cascade="all, delete-orphan",
        order_by="HargaProduk.tanggal"
    )

    def __repr__(self):
        return f"<Produk(nama='{self.nama}', stok={self.stok}, harga={self.harga})>"
