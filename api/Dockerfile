FROM python:3.11-slim AS rye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app/src:$PYTHONPATH"
ENV RYE_HOME="/opt/rye"
ENV PATH="$RYE_HOME/shims:$PATH"

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential curl procps vim-tiny \
  && curl -sSf https://rye-up.com/get | RYE_NO_AUTO_INSTALL=1 RYE_INSTALL_OPTION="--yes" bash

COPY pyproject.toml requirements.lock requirements-dev.lock .python-version README.md ./
RUN rye sync --no-dev --no-lock
RUN . .venv/bin/activate

FROM rye AS data
COPY setup.py ./
RUN python setup.py

FROM rye AS run

# App server port
ENV PORT="8080"
ENV HOST="0.0.0.0"
ENV DATABASE_URL="file:/app/data/sangokushi.db?connection_limit=1"

COPY --from=data /app/model ./model
COPY server.py sangokushi.db ./
COPY src src
COPY prisma prisma
RUN rye run prisma generate

ENTRYPOINT ["sh", "-c", "/app/.venv/bin/uvicorn server:app --host $HOST --port $PORT"]
