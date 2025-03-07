"""fixed payslips

Revision ID: 03cea2863e94
Revises: 
Create Date: 2025-03-07 22:56:38.406909

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '03cea2863e94'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payslip', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hours', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('deductions', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('pay', sa.Float(), nullable=True))

    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.drop_constraint('shift_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key(None, 'payslip', ['payslip_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('pointer', sa.Date(), nullable=True))
        batch_op.add_column(sa.Column('last_pay', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('cutoff_index', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('cutoff_index')
        batch_op.drop_column('last_pay')
        batch_op.drop_column('pointer')

    with op.batch_alter_table('shift', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('shift_ibfk_2', 'payslip', ['payslip_id'], ['id'])

    with op.batch_alter_table('payslip', schema=None) as batch_op:
        batch_op.drop_column('pay')
        batch_op.drop_column('deductions')
        batch_op.drop_column('hours')

    # ### end Alembic commands ###
