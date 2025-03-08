FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Prisma schema and backend code
COPY prisma /app/prisma
COPY main.py /app/main.py
COPY wait-for-db.sh /app/wait-for-db.sh

# Make the wait script executable
RUN chmod +x /app/wait-for-db.sh

EXPOSE 8000

CMD [ "sh", "-c", "/app/wait-for-db.sh && prisma generate && prisma migrate deploy && uvicorn main:app --host 0.0.0.0 --port 8000" ]
