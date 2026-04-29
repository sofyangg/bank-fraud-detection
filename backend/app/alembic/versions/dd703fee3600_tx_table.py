"""tx table

Revision ID: dd703fee3600
Revises: fe56fa70289e
Create Date: 2026-04-29 00:48:49.295639

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'dd703fee3600'
down_revision = 'fe56fa70289e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "Transaction",
        sa.Column("transaction_id",sa.String(),nullable=False),
        sa.Column("user_id",sa.String(),index=True, unique=True,nullable=False),
        sa.Column("transaction_amount",sa.Float(),nullable=False),
        sa.Column("account_balance",sa.Float(),nullable=False),
        sa.Column("avg_transaction_amount_7d",sa.Float(),nullable=False),
        sa.Column("transaction_distance",sa.Float(),nullable=False),
        sa.Column("risk_score",sa.Float(),nullable=False),
        sa.Column("transaction_type",sa.String(),nullable=False),
        sa.Column("device_type",sa.String(),nullable=False),
        sa.Column("location",sa.String(),nullable=False),
        sa.Column("merchant_category",sa.String(),nullable=False),
        sa.Column("card_type",sa.String(),nullable=False),
        sa.Column("authentication_method",sa.String(),nullable=False),
        sa.Column("timestamp",sa.DateTime(),nullable=False),
        sa.Column("ip_address_flag",sa.Integer(),nullable=False),
        sa.Column("previous_fraudulent_activity",sa.Integer(),nullable=False),
        sa.Column("is_weekend",sa.Integer(),nullable=False),
        sa.Column("fraud_label",sa.Integer(),nullable=True),
        sa.Column("daily_transaction_count",sa.Integer(),nullable=False),
        sa.Column("failed_transaction_count_7d",sa.Integer(),nullable=False),
        sa.Column("card_age",sa.Integer(),nullable=False),
        sa.PrimaryKeyConstraint('transaction_id')
    )


def downgrade():
    pass
