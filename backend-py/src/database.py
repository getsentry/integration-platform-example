import os
import contextlib
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from src import app

engine = create_engine(app.config["DATABASE"])
db_session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
        # Disable object expiration to make testing with fixtures easier
        expire_on_commit=os.getenv("FLASK_ENV") != 'test'
    )
)

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    from . import models  # NOQA
    Base.metadata.create_all(bind=engine)


def clear_tables():
    with contextlib.closing(engine.connect()) as connection:
        transaction = connection.begin()
        for table in reversed(Base.metadata.sorted_tables):
            connection.execute(table.delete())
        transaction.commit()


def drop_tables():
    Base.metadata.drop_all(bind=engine)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


init_db()
