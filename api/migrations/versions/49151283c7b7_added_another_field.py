"""added another field

Revision ID: 49151283c7b7
Revises: c100cd815fa4
Create Date: 2024-11-03 21:58:13.570988

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '49151283c7b7'
down_revision = 'c100cd815fa4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category', sa.String(length=32), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.drop_column('category')

    # ### end Alembic commands ###
