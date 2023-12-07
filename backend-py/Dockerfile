FROM python:3.9-slim as backend-py

RUN apt update && \
  apt install -y python3-dev gcc libpq-dev

WORKDIR /backend-py
# Re-create the requirements layer if the requirements change
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the source code now, otherwise, code changes will invalidate the requirements cache
COPY . .
# Preparing startup...
CMD ["flask", "run"]
