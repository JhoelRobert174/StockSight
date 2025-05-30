"""initial fresh start

Revision ID: c72201fdbf1c
Revises: 
Create Date: 2025-05-29 17:48:23.956243

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c72201fdbf1c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('kategori_nama_lower_idx', table_name='kategori')
    op.add_column('user', sa.Column('email', sa.String(length=255), nullable=False))
    op.create_unique_constraint(op.f('uq_user_email'), 'user', ['email'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('uq_user_email'), 'user', type_='unique')
    op.drop_column('user', 'email')
    op.create_index('kategori_nama_lower_idx', 'kategori', [sa.literal_column('lower(nama::text)')], unique=True)
    # ### end Alembic commands ###
