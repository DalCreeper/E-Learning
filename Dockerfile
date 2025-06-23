# Usa l'immagine Node ufficiale
FROM node:18-alpine

# Imposta la working directory nel container
WORKDIR /app

# Copia i file di configurazione del progetto
COPY package*.json ./

# Installa le dipendenze globali (Angular CLI)
RUN npm install -g @angular/cli

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto dei file del progetto
COPY src/ src/
COPY angular.json package.json package-lock.json tsconfig.app.json tsconfig.json tsconfig.spec.json ./

# Espone la porta 4200 (default di Angular dev server)
EXPOSE 4200

# Avvia il server Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]