"""tabel user

Revision ID: 566f0f3356af
Revises: 7bc4198955dc
Create Date: 2025-05-27 03:59:43.536017

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '566f0f3356af'
down_revision = '7bc4198955dc'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=150), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_user')),
    sa.UniqueConstraint('username', name=op.f('uq_user_username'))
    )
    op.drop_index('my_index', table_name='models')
    op.drop_table('models')
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('models',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('value', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='pk_models')
    )
    op.create_index('my_index', 'models', ['name'], unique=True)
    op.drop_table('user')
    # ### end Alembic commands ###
