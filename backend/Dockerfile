FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

# Install required packages and Prisma CLI
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install prisma

COPY data /app/data
COPY prisma /app/prisma
COPY main.py /app/main.py

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]