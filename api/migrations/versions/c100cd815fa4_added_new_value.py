"""added new value

Revision ID: c100cd815fa4
Revises: 
Create Date: 2024-09-07 23:00:54.018886

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c100cd815fa4'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.add_column(sa.Column('has_removed', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.drop_column('has_removed')

    # ### end Alembic commands ###
