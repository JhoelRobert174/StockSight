from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .meta import Base

class MutasiStok(Base):
    __tablename__ = 'mutasi_stok'

    id = Column(Integer, primary_key=True)
    produk_id = Column(Integer, ForeignKey('produk.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    aksi = Column(String(10), nullable=False)  # 'masuk' / 'keluar'
    jumlah = Column(Integer, nullable=False)
    harga_saat_mutasi = Column(Numeric(12, 2), nullable=True)
    keterangan = Column(String(255), nullable=True)
    waktu = Column(DateTime(timezone=True), server_default=func.now())

    produk = relationship("Produk")
    user = relationship("User")


# Attention! Fitur MutasiStok saat ini tidak digunakan aktif di sistem.
# Disiapkan untuk pencatatan histori perubahan stok (jika ingin tracking granular).
# Saat ini, log aktivitas umum sudah cukup.
