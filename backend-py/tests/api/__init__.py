from .base import APITestCase
from src.database import init_db, drop_tables

__all__ = ("APITestCase",)

drop_tables()
init_db()
