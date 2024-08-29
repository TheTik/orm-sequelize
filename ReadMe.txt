https://sequelize.org/

docker-compose up -d
# npm install --save mysql2
# npm install --save sequelize
# npm install --save pg pg-hstore # Postgres
# npm install express
# npm install cors
# npm install jsonwebtoken
# npm install bcrypt
# npm install cookie-parser
# npm install dotenv --save
# npm install --save-dev nodemon

# npm i @sequelize/mssql # SQL Server

# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database

***********************************************************************************************************************************************************************************
postgres
***********************************************************************************************************************************************************************************
docker pull postgres
docker run --name appdev-postgres --rm -e POSTGRES_USER=appdev -e POSTGRES_PASSWORD=appdev -d -p 5432:5432 postgres
docker ps -a
docker exec -it appdev-postgres psql -U postgres
docker stop postgres

docker run --name appdev-postgres --rm -e POSTGRES_USER=appdev -e POSTGRES_PASSWORD=appdev -d -p 5432:5432 -v D:\Docker\pgdev:/var/lib/postgresql/data postgres

Creating a PostgreSQL Docker Container with a Volume on Windows
https://voiceofthedba.com/2023/01/09/creating-a-postgresql-docker-container-with-a-volume-on-windows/

docker pull dpage/pgadmin4
docker run --name appdev-pg4 -p 8088:80 -e PGADMIN_DEFAULT_EMAIL=appdev@gmail.com -e PGADMIN_DEFAULT_PASSWORD=appdev -e PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION=True -d dpage/pgadmin4

docker network ls
---------------------------------------------------------------------------------------------------
C:\>docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
84ca0f124572   bridge    bridge    local
027ea4887cf9   host      host      local
a951d0038672   none      null      local
---------------------------------------------------------------------------------------------------
docker network inspect bridge
---------------------------------------------------------------------------------------------------
[
    {
        "Name": "bridge",
        "Id": "84ca0f1245723fcef80d4b1c85706bb14ba4c529357b9d88e172eb410fd6d568",
        "Created": "2024-08-23T07:43:48.082952066Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.17.0.0/16",
                    "Gateway": "172.17.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "7e3de6c16954d6b28312f1cd92270214b4f01fbb0752a7f12e53972a93a2f7f1": {
                "Name": "pg4",
                "EndpointID": "f9191249a318cf88d39feb1abcb05ee1566a09dac236c2c2ee15946e65881d91",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            },
            "b97b49cae31d63f281eb7e8d156e4a550251cfc69f7bda12c913b29d8ee1793a": {
                "Name": "appdev-postgres",
                "EndpointID": "8c078b74c44dd4875910bf74c0b95f2eeddc97a8d235f11c15ae1eba0d9a0b4a",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {
            "com.docker.network.bridge.default_bridge": "true",
            "com.docker.network.bridge.enable_icc": "true",
            "com.docker.network.bridge.enable_ip_masquerade": "true",
            "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
            "com.docker.network.bridge.name": "docker0",
            "com.docker.network.driver.mtu": "1500"
        },
        "Labels": {}
    }
]
---------------------------------------------------------------------------------------------------
หา "Name": "pg4",
จเะมี IpAddress อยู่ ให้เอาไปใส เป้น host ของ database
                "Name": "appdev-postgres",
                "EndpointID": "8c078b74c44dd4875910bf74c0b95f2eeddc97a8d235f11c15ae1eba0d9a0b4a",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": "
---------------------------------------------------------------------------------------------------

***********************************************************************************************************************************************************************************
MySql
***********************************************************************************************************************************************************************************

docker --version

- pull docker image
docker pull mysql

- list images
docker images

- run mysql on docker
docker run --name appdev-mysql --rm -p 3306:3306 -e MYSQL_ROOT_PASSWORD=appdev -d mysql

- list processes
docker ps -a

- exec command in container
docker exec -it appdev-mysql mysql -u root -p

- connect to mysql from terminal
* mysql -u root -p -h localhost -P 3306 --protocol=tcp
* mysql -u root -p -P 3306 --protocol=tcp
* mysqlsh root@localhost:3306 --sql

- stop process
docker stop appdev-mysql

- persist data (using volume)
docker run --name appdev-mysql --rm -p 3306:3306 -d -e MYSQL_ROOT_PASSWORD=appdev -v D:\Docker\mysql:/var/lib/mysql mysql

***********************************************************************************************************************************************************************************
phpMyAdmin
***********************************************************************************************************************************************************************************
- pull docker image
docker pull phpmyadmin/phpmyadmin

- run phpMyAdmin on docker
docker run --rm --name appdev-phpmyadmin -d --link appdev-mysql:db -p 8085:80 phpmyadmin/phpmyadmin                                                                              

***********************************************************************************************************************************************************************************
Microsoft SQL Server - Ubuntu based images
***********************************************************************************************************************************************************************************
- pull docker image
docker pull mcr.microsoft.com/mssql/server

docker run --rm --name appdev-mssql -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Superman@2024'  -p 1433:1433 -d mcr.microsoft.com/mssql/server

- persist data (using volume)
docker run --rm --name appdev-mssql -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Superman@2024' -p 1433:1433 -v D:\Docker\mssql:/var/opt/mssql -d mcr.microsoft.com/mssql/server

docker exec -it appdev-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Superman@2024


