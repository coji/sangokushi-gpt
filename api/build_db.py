import asyncio

from src.sangokushi_api.commands.build_db import build_db

if __name__ == "__main__":
    asyncio.run(build_db("sangokushi.db"))
