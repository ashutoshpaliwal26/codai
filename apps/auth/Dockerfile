FROM ubuntu 

WORKDIR /app


# Copy package.json and install dependencies
COPY package.json ./
RUN apt-get update && \
    apt-get install -y curl xz-utils make g++ python3 && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest
    
RUN node -v && npm -v
    
RUN npm install

# Copy source files
COPY . .

# Build app 
RUN npm run build

EXPOSE 8000

CMD [ "npm" ,"start" ]
