FROM node:22-alpine

WORKDIR /app

# Instalacja zależności
COPY package.json package-lock.json* ./
RUN npm install

# Kopiowanie kodu aplikacji
COPY . .

# Wystawienie portu 5173
EXPOSE 5173

# Uruchomienie serwera deweloperskiego Vite
# Flaga --host jest niezbędna, aby aplikacja była widoczna poza kontenerem
CMD ["npm", "run", "dev", "--", "--host"]