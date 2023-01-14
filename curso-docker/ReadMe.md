# Docker

## Imagem x Container

Imagem é como se fosse o modelo (classe) e o container (objeto) como se fosse um objeto criado a partir do modelo

## Comandos

### Docker run

O comando **docker run** é a fusão dos comandos docker image pull, docker container create, docker container start e docker container exec (em modo interativo) e sempre cria um novo container. 

O docker pode ser executado em dois modos: daemon e interativo

```bash
# Exibe os processos que estão em execução
docker container ps

# Exibe os processos todos os container que já foram executados
docker container ps -a
```

```bash
# remove um container
docker container run --rm debian bash --version
```

```bash
# i = interativo
# t = acessar o terminal
docker container run -it debian bash
```

Os containers precisam ter nomes únicos
```bash
# name = nome atribuído ao container
docker container run --name mydeb -it debian bash
```

```bash
# lista os containers
docker container ls

# lista os containers já executados
docker container ls -a
```

```bash
# a = attach
# i = interativo
docker container start -ai mydeb
```

Passos importantes para a reutilização dos containers: 
1. Dar um nome relevante ao container
1. Executar o container com o comando start

### Mapear portas para o container

Para mapear uma porta do container é preciso usar a flag **-p** informando qual a porta será exposta pelo container e a qual porta interna ela está associada dentro do container

```bash
# A porta 8080 está sendo exposta e intermante o container usa a parto 80
docker container run -p 8080:80 nginx
```

### Mapear diretórios para o container

Para mapear uma porta do container é preciso usar a flag **-v** informando o caminho do volume do host e a pasta do container. É possível acessar as sub-pastas do volume mas não as pastas externas

```bash
# Execução com erro pois a pasta not-found não existe
docker container run -p 8080:80 -v $(pwd)/not-found:/usr/share/nginx/html nginx

# Execução com sucesso
docker container run -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx
```

### Executar um servidor web em background

```bash
# -d = daemon (background)
docker container run -d --name ex-daemon-basic -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx
```

### Gerenciar container em background

```bash
# start = inicia o container
docker container start ex-daemon-basic

# restart = reinicia o container
docker container restart ex-daemon-basic

# stop = para o container
docker container stop ex-daemon-basic
```

### Manipulação de containers em modo daemon

```bash
docker container ps

docker container ls

docker container list

# sintaxe antiga
docker ps

# exibe os logs do container que foram executados
docker container logs ex-daemon-basic

# exibe as informações do container
docker container inspect ex-daemon-basic

docker container exec ex-daemon-basic uname -or
```

### Desafio executar o site no Tomcat

```bash
# para acessar o site use o endereço https://localhost:8888/static
docker run -d --name ex-tomcat9 --rm -p 8888:8080 -v $(pwd)/html:/usr/local/tomcat/webapps/static tomcat:9.0
```