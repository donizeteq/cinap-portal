FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3014
CMD ["npm", "run", "dev", "--", "--port", "3014", "--host", "0.0.0.0"]
