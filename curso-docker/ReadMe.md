# Docker

## Imagem

Imagem é um sistema de arquivo de somente leitura que será usado pelo container. Somente a última camada pode ser alterada

```bash
docker container --help

docker image --help

docker volume --help
```

## Imagem x Container

Imagem é como se fosse o modelo (classe) e o container (objeto) como se fosse um objeto criado a partir do modelo

## Comandos

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

Para mapear uma porta do container é preciso usar a flag **-v** informando o caminho do volume do host mais dois pontos (:) e a pasta do container. É possível acessar as sub-pastas do volume mas não as pastas externas

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

### Imagens

```bash
# baixar uma imagem diretamente do docker hub
docker image pull redis:latest

# listar as imagens
docker image ls

# criar tag (ponteiros para imagens específicas)
docker image tag redis:latest ph-redis

# remove uma imagem
docker image rm ph-redis

# inspecionar a imagem
docker image inspect redis:latest

# processo de build de uma imagem
docker image build

# publica uma imagem em um registry local ou no docker hub
docker image push

```
Obs: Não é interessante usar a última versão de uma imagem

### Descritor de imagem

O arquivo onde a sua imagem é descrita é chamado **Dockerfile**. Nele é possível definir qual imagem será baixada, qual comando será executado, qual porta será exposta, qual volume será mapeado, etc, conforme um passo-a-passo

```Dockerfile
FROM nginx:latest
RUN echo '<h1>Hello world</h1>' > /usr/share/nginx/index.html
```

Para efetuar o build da imagem 

```bash
cd ex-simple-build
docker image build -t ex-simple-build .
```

Para executar o container

```bash
docker container run -p 80:80 ex-simple-build
```

Dockerfile com argumentos

```Dockerfile
# cada comando se torna uma camada
FROM debian
LABEL maintainer 'Aluno Cod3r <PH at cod3r.com.br>'

ARG S3_BUCKET=files
ENV S3_BUCKET=${S3_BUCKET}
```

Para efetuar o build da imagem 

```bash
cd ex-build-arg
# sem informar os argumentos
docker image build -t ex-build-arg .

#informando argumentos
# -t = tag
docker image build --build-arg S3_BUCKET=myapp -t ex-build-arg . 
```

Para executar o container

```bash
docker container run ex-build-arg bash -c 'echo $S3_BUCKET' d

# sem argumentos imprime files
# com argumentos imprime myapp

# filtrando com inspect
docker image inspect --format="{{index .Config.Labels \"maintainer\"}}" ex-build-arg
```

Dockerfile com copy

```Dockerfile
# cada comando se torna uma camada
FROM nginx:latest
LABEL maintainer 'Paulo Barros <paulo.barros@email.com>'

# será criado o arquivo conteudo.hmtl com o texto <h1>Sem conteúdo</h1>
RUN echo '<h1>Sem conteúdo</h1>' > /usr/share/nginx/html/conteudo.html

# copia qualquer arquivo .html para a pasta html do nginx
COPY *.html /usr/share/nginx/html/
```

Para efetuar o build da imagem 

```bash
cd ex-build-copy
# -t = tag
docker image build -t ex-build-copy . 
```

Para executar o container

```bash
docker container run -p 80:80 ex-build-copy  
```

Servidor Python

```Dockerfile
# cada comando se torna uma camada
FROM python:3.6
LABEL maintainer 'Paulo Barros <paulo.barros@email.com>'

RUN useradd www && \
    mkdir /app && \
    mkdir /log && \
    chown www /log

USER www
VOLUME /log
WORKDIR /app
EXPOSE 8000

ENTRYPOINT [ "/usr/local/bin/python" ]
CMD ["run.py"]
```

Para efetuar o build da imagem 

```bash
cd ex-build-dev
# -t = tag
docker image build -t ex-build-dev . 
```

Para executar o container

```bash
docker container run -it -v $(pwd):/app -p 80:8000 --name python-server ex-build-dev
```

Lendo um volume compartilhado

É necessário usar a flag **--volumnes-from** informando o nome do container que você quer acessar. No caso abaixo estamos usando a imagem do debian e executando o comando cat no arquivo /log/http-server.log 

```bash
docker container run -it --volumes-from=python-server debian cat /log/http-server.log 
```

## Enviar imagens para o Docker Hub

Criar a tag

```bash
docker image tag ex-simple-build phcbarros/simple-build:1.0
```

Efetuar o login no Docker Hub
```bash
docker login
```

Upload da imagem

```bash
docker image push phcbarros/simple-build:1.0
```

## Docker Hub x Docker Registry

Docker Registry é um serviço server-side para registro e obtenção de imagens
Docker Hub (SaaS) é um produto na nuvem disponibilizado pelo Docker que possui um sistema de registry com uma interface gráfica e disponibiliza imagens oficiais criadas e mantidas pelos times do Docker