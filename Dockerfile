FROM oven/bun

WORKDIR /app

COPY ./package.json .

RUN bun install

COPY ./prisma .
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'bunx prisma generate' >> /entrypoint.sh && \
    echo 'bunx prisma db push' >> /entrypoint.sh && \
    echo 'bun dev' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]