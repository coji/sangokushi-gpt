FROM qdrant/qdrant
ARG ENV=production

COPY qdrant.config.${ENV}.yaml /qdrant/config/production.yaml
WORKDIR /qdrant
CMD ["./qdrant"]
