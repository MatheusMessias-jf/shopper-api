Criando uma API REST com Express
---

Este é um projeto feito para um teste técnico implementando uma api
utilizando [Node.js](https://nodejs.org/en/) e o _framework_ [Express](https://expressjs.com/).

Essa api é responsável por automatizar a leitura de medidores de gás e água utilizando IA para isso através de uma imagem do medidor.

A api possui 3 endpoints:
 - /upload: recebe a imagem em base64, o código do cliente, a data da medição e o tipo de medição ```WATER``` ou ```GAS``` e a partir disso salva no bando de dados essa leitura.
   
 - /confirm: recebe o id da leitura realizada e a confirmação do valor da leitura e atualiza a leitura com o valor confirmado caso seja necessário
   
 - /<customer_code>/list: lista todas as medições realizadas para o cliente ```customer_code``` passado com param. Pode receber um query param que filtra apenas as leituras de água ou gás

# Utilização

O projeto está dockerizado, e para exeutar você vai precisar criar um arquivo ```.env``` na raiz, contendo a variável de ambiente ```GEMINI_API_KEY```, onde você deve inserir a chave da api do gemini para execução das queries.
Para rodar o contêiner com o banco e a aplicação, é necessário ter o docker instalado e rodar o seguinte comando no diretório do projeto:

``` shell
sudo docker compose up --build
```
