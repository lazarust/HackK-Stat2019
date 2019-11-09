FROM tiangolo/uwsgi-nginx-flask:python3.7
COPY ./MinecraftApp /code/MinecraftApp
WORKDIR /code
ENV FLASK_APP MinecraftApp
ENV FLASK_RUN_HOST 0.0.0.0
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["flask", "run"]
