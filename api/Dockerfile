ARG PYTHON_BASE_IMAGE='python'
FROM ${PYTHON_BASE_IMAGE}:3.11-slim AS rye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app/src:$PYTHONPATH"
ENV RYE_HOME="/opt/rye"
ENV PATH="$RYE_HOME/shims:$PATH"

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential curl procps vim-tiny sqlite3 ca-certificates fuse3 \
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
ENV HOST="::"

COPY --from=data /app/model ./model
COPY server.py sangokushi.db ./

ENTRYPOINT ["sh", "-c", "/app/.venv/bin/uvicorn server:app --host $HOST --port $PORT"]
