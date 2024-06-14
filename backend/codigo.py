from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

pd.set_option("display.max_rows", None)

df = pd.read_csv("dengue2021_recife.csv", delimiter=";", dtype={54:'string', 62:"string"})

#Remove os "40" de frente das idades e depois remove valores vazios
df['idade_modificada'] = df.nu_idade.astype(str).str[2:]
df = df[df.idade_modificada != '']

@app.route("/media_idade")
def media_idade():
    media_idade = df.idade_modificada.astype(int).mean()
    return "<p>" + str(media_idade) + "</p>"

#def contagem_idade():
    #contagem_idade = df.idade_modificada.value_counts()

@app.route("/contagem_bairro/<ano>")
def contagem_bairro(ano):
    df = pd.read_csv(f'dengue{ano}_recife.csv', delimiter=";", dtype={54:'string', 62:"string"})
    contagem_bairro = df.no_bairro_residencia.value_counts().to_dict()
    return jsonify(contagem_bairro)

@app.route("/contagem_data/<ano>")
def contagem_data(ano):
    df = pd.read_csv(f'dengue{ano}_recife.csv', delimiter=";", dtype={54:'string', 62:"string"})
    contagem_data = df.dt_notificacao.value_counts().sort_index(ascending=True).to_dict()
    return jsonify(contagem_data)

@app.route("/contagem_sexo/<ano>")
def contagem_sexo(ano):
    df = pd.read_csv(f'dengue{ano}_recife.csv', delimiter=";", dtype={54:'string', 62:"string"})
    casos_homens = len(df[df.tp_sexo == "M"])
    casos_mulheres = len(df[df.tp_sexo == "F"])
    response = {
        "casos_homens": casos_homens,
        "casos_mulheres": casos_mulheres
    }
    response = jsonify(response)
    response.headers['Content-Type'] = 'application/json'
    return response
