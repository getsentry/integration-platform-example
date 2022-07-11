# syntax=docker/dockerfile:1
# Slim layes carry a lot less
FROM python:3.9-slim as backend-py

WORKDIR /backend-py
# Re-create the requirements layer if the requirements change
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the source code now, otherwise, code changes will invalidate the requirements cache
COPY ./src/* /backend-py/
# Preparing startup...
CMD ["flask", "run"]
