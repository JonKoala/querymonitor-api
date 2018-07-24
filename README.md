# querymonitor-api
API para a aplicação web _querymonitor_.

## Requisitos
 - [Node](https://nodejs.org) >= 8
 - Database SQL Server 2014

## Instalação
Clone o projeto para a sua máquina e acesse o diretório do mesmo.
``` bash
$ git clone https://github.com/JonKoala/querymonitor-api.git
$ cd querymonitor-api
```
Instale as dependências.
``` bash
$ npm install
```

## Configuração
O projeto depende de arquivos de configuração, que devem ficar no diretório `config/`.

Deve existir um arquivo de configurações para cada ambiente em que o projeto irá trabalhar. Atualmente a API aceita arquivos para os ambientes de desenvolvimento (arquivo `dev.yml`), testes (arquivo `test.yml`) e produção (arquivo `prod.yml`).

Para criar um arquivo de configurações novo, crie uma cópia do arquivo `default.yml.example`, renomeie de acordo com o ambiente e altere o conteúdo do arquivo.

Exemplo de arquivo de configurações:
``` yaml
server:
  port: 8080

db:
  host: '.\SQLEXPRESS'
  database: 'QUERYMONITOR'
  driver: 'SQL Server Native Client 11.0'
```

## Execução
Para subir o servidor da API, basta executar o comando `start` do _npm_.
``` bash
$ npm start
```
Caso não ocorra nenhum erro, um servidor deve ser criado, usando a porta especificada no arquivo de configurações (_e.g `http://localhost:8080/`_).

## Testes
A API possui uma bateria de testes automatizados.

Note que __é importante criar um banco de dados exclusivo para a realização das rotinas de testes__, uma vez que __as rotinas de testes vão manipular os dados do banco__. Essa manipulação é necessária para simular as situações em que a API será testada.

As configurações específicas para o ambiente de testes (como qual banco será usado) devem estar no arquivo `test.yml`, no diretório `config/`.

Para executar as rotinas de testes, basta executar o comando `test` do _npm_.
``` bash
$ npm test
```
Ao final da execução, um relatório com o desempenho da API deve ser exibido.
