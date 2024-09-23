# Usa la imagen oficial de PostgreSQL
FROM postgres:13

# Establece las variables de entorno necesarias
ENV POSTGRES_DB=db_helpdesk
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Copia el archivo SQL de inicialización en la carpeta de Docker
COPY ./db_helpdesk.sql /docker-entrypoint-initdb.d/

# Define el comando por defecto
CMD ["postgres"]

# Exponer el puerto por defecto de PostgreSQL
EXPOSE 5432
