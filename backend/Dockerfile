FROM python:3.10-slim

WORKDIR /app

# Install PostgreSQL client for pg_isready
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt && pip install prisma

# Copy Prisma schema and backend code
COPY prisma /app/prisma
COPY main.py /app/main.py
COPY wait-for-db.sh /app/wait-for-db.sh

# Make the wait script executable
RUN chmod +x /app/wait-for-db.sh

EXPOSE 8000

# Use the wait script as the entrypoint
CMD ["/app/wait-for-db.sh"]