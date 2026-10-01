"""update memories to list on generate table

Revision ID: 177720940ea8
Revises: b020eeb7cf96
Create Date: 2026-09-27 13:26:42.405663

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '177720940ea8'
down_revision: Union[str, Sequence[str], None] = 'b020eeb7cf96'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute("""
        ALTER TABLE generations
        ALTER COLUMN memories
        TYPE JSONB
        USING (
            CASE
                WHEN memories IS NULL OR memories = ''
                    THEN '[]'::jsonb
                ELSE jsonb_build_array(
                    jsonb_build_object(
                        'memory', memories,
                        'significance', NULL,
                        'emphasis', false
                    )
                )
            END
        )
    """)

    op.alter_column(
        "generations",
        "memories",
        existing_type=postgresql.JSONB(
            astext_type=sa.Text(),
        ),
        nullable=False,
        server_default=sa.text("'[]'::jsonb"),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.alter_column(
        "generations",
        "memories",
        server_default=None,
    )

    op.alter_column(
        "generations",
        "memories",
        existing_type=postgresql.JSONB(
            astext_type=sa.Text(),
        ),
        type_=sa.VARCHAR(),
        nullable=True,
        postgresql_using="memories::text",
    )