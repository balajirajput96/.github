FROM nikolaik/python-nodejs:python3.12-nodejs22

WORKDIR /app

# Copy the entire project
COPY . .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js backend dependencies
WORKDIR /app/web-app/server
RUN npm install

# Install Node.js frontend dependencies and build
WORKDIR /app/web-app/client
RUN npm install
RUN npm run build

# Start the server
WORKDIR /app/web-app/server
EXPOSE 3001
ENV PORT=3001
CMD ["npm", "start"]
