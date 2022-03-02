FROM python:3.9 as backend-py
# Installing packages...
WORKDIR /backend-py
COPY . .
RUN pip install -r requirements.txt
# Preparing startup...
CMD ["flask", "run"]
