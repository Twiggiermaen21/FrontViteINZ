
docker build -t neocal-frontend .
docker run -d -p 5173:5173 --name neocal-frontend neocal-frontend