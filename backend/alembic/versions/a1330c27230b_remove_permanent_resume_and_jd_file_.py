from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "a1330c27230b"
down_revision: Union[str, Sequence[str], None] = "7a7fb117c4f3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("jds", "raw_file_path")
    op.drop_column("jds", "file_type")
    op.drop_column("jds", "raw_text")

    op.drop_column("resumes", "raw_file_path")
    op.drop_column("resumes", "file_type")
    op.drop_column("resumes", "raw_text")


def downgrade() -> None:
    op.add_column(
        "jds",
        sa.Column("raw_file_path", sa.String(), nullable=True),
    )
    op.add_column(
        "jds",
        sa.Column("file_type", sa.String(), nullable=True),
    )
    op.add_column(
        "jds",
        sa.Column("raw_text", sa.Text(), nullable=True),
    )

    op.add_column(
        "resumes",
        sa.Column("raw_file_path", sa.String(), nullable=True),
    )
    op.add_column(
        "resumes",
        sa.Column("file_type", sa.String(), nullable=True),
    )
    op.add_column(
        "resumes",
        sa.Column("raw_text", sa.Text(), nullable=True),
    )