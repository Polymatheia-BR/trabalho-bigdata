from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

pd.set_option("display.max_rows", None)

def load_data2(ano):
    data = pd.read_csv(f'dados/inmet_recife_{ano}.CSV', delimiter=";", dtype={54: 'string', 62: 'string'})

    main_columns = ["precipitacao", "press", "press_max", "press_min", "rad", "temp",
                    "t_max", "t_min", "umid_max", "umid_min", "umid", "vento_dir",
                    "vento_max", "vento"]

    data[main_columns] = data[main_columns].replace([-9999], np.nan)
    data.replace('', np.nan, inplace=True)
    data = data.dropna(subset=main_columns, how='all')

    numeric_columns = ["precipitacao", "press", "press_max", "press_min", "rad", "temp",
                       "t_max", "t_min", "umid_max", "umid_min", "umid", "vento_max", "vento"]

    data[numeric_columns] = data[numeric_columns].apply(pd.to_numeric, errors='coerce')
    data['data'] = pd.to_datetime(data['data'], format='%d/%m/%Y', errors='coerce')
    data = data.dropna(subset=['data'])
    data['month'] = data['data'].dt.month

    return data


@app.route('/dados_meteorologicos/<ano>', methods=["GET"])
def dados_meteorologicos(ano):
    data = load_data2(ano)

    cols = ["precipitacao", "press", "rad", "temp", "umid", "vento"]

    monthly_data = data.groupby('month')[cols].mean().reset_index()

    monthly_data[cols] = monthly_data[cols].apply(lambda x: x.fillna(x.mean(skipna=True)))
    monthly_data[cols] = monthly_data[cols].apply(lambda x: x.clip(lower=0))
    monthly_data[cols] = monthly_data[cols].fillna(0)

    return jsonify(monthly_data.to_dict(orient='list'))

def calcular_padroes_vento(data, sort_by_count=True, normalize=False):
    filtered_data = data.dropna(subset=['vento_dir'])

    padroes_vento = filtered_data['vento_dir'].value_counts(normalize=normalize)

    if sort_by_count:
        padroes_vento = padroes_vento.sort_values(ascending=False)

    return padroes_vento

@app.route('/padroes_vento/<ano>')
def obter_padroes_vento(ano):
    dados = load_data2(ano)
    padroes_vento = calcular_padroes_vento(dados)
    return jsonify({'padroes_vento': padroes_vento.to_dict()})


def load_data(ano):
    df = pd.read_csv(f'dados/dengue{ano}_recife.csv', delimiter=";", dtype={54: 'string', 62: 'string'})

    df['idade_modificada'] = df.nu_idade.astype(str).str[2:]
    df = df[df.idade_modificada != '']

    return df


@app.route("/media_idade/<ano>")
def media_idade(ano):
    df = load_data(ano)
    media_idade = df.idade_modificada.astype(int).mean()
    return jsonify({"media_idade": media_idade})

@app.route("/contagem_bairro/<ano>")
def contagem_bairro(ano):
    df = load_data(ano)
    contagem_bairro = df.no_bairro_residencia.value_counts().to_dict()
    return jsonify(contagem_bairro)

@app.route("/contagem_data/<ano>")
def contagem_data(ano):
    df = load_data(ano)
    contagem_data = df.dt_notificacao.value_counts().sort_index(ascending=True).to_dict()
    return jsonify(contagem_data)


@app.route("/contagem_sexo/<ano>")
def contagem_sexo(ano):
    df = load_data(ano)
    casos_homens = len(df[df.tp_sexo == "M"])
    casos_mulheres = len(df[df.tp_sexo == "F"])
    response = {
        "casos_homens": casos_homens,
        "casos_mulheres": casos_mulheres
    }
    return jsonify(response)

@app.route("/contagem_sexo_faixa_etaria/<ano>")
def contagem_sexo_faixa_etaria(ano):
    df = load_data(ano)

    faixas_etarias = [
        {"faixa": "0-10", "inicio": 0, "fim": 10},
        {"faixa": "11-20", "inicio": 11, "fim": 20},
        {"faixa": "21-30", "inicio": 21, "fim": 30},
        {"faixa": "31-40", "inicio": 31, "fim": 40},
        {"faixa": "41-50", "inicio": 41, "fim": 50},
        {"faixa": "51-60", "inicio": 51, "fim": 60},
        {"faixa": "61+", "inicio": 61, "fim": float('inf')}
    ]

    contagem_sexo_faixa_etaria = {faixa['faixa']: {"M": 0, "F": 0} for faixa in faixas_etarias}

    for index, row in df.iterrows():
        idade = int(row['idade_modificada'])
        sexo = row['tp_sexo']

        faixa_encontrada = False
        for faixa in faixas_etarias:
            if faixa['inicio'] <= idade <= faixa['fim']:
                if sexo in contagem_sexo_faixa_etaria[faixa['faixa']]:
                    contagem_sexo_faixa_etaria[faixa['faixa']][sexo] += 1
                else:
                    print(f"Erro: Sexo {sexo} não está definido para a faixa {faixa['faixa']}.")
                faixa_encontrada = True
                break

        if not faixa_encontrada:
            print(f"Erro: Idade {idade} não se encaixa em nenhuma faixa etária definida.")

    response = {
        "contagem_sexo_faixa_etaria": contagem_sexo_faixa_etaria
    }

    return jsonify(response)

def calcular_contagem_sexo_faixa_etaria(df):
    faixas_etarias = [
        {"faixa": "0-10", "inicio": 0, "fim": 10},
        {"faixa": "11-20", "inicio": 11, "fim": 20},
        {"faixa": "21-30", "inicio": 21, "fim": 30},
        {"faixa": "31-40", "inicio": 31, "fim": 40},
        {"faixa": "41-50", "inicio": 41, "fim": 50},
        {"faixa": "51-60", "inicio": 51, "fim": 60},
        {"faixa": "61+", "inicio": 61, "fim": float('inf')}
    ]

    contagem_sexo_faixa_etaria = {faixa['faixa']: {"M": 0, "F": 0} for faixa in faixas_etarias}

    for index, row in df.iterrows():
        idade = int(row['idade_modificada'])
        sexo = row['tp_sexo']

        faixa_encontrada = False
        for faixa in faixas_etarias:
            if faixa['inicio'] <= idade <= faixa['fim']:
                if sexo in contagem_sexo_faixa_etaria[faixa['faixa']]:
                    contagem_sexo_faixa_etaria[faixa['faixa']][sexo] += 1
                else:
                    print(f"Erro: Sexo {sexo} não está definido para a faixa {faixa['faixa']}.")
                faixa_encontrada = True
                break

        if not faixa_encontrada:
            print(f"Erro: Idade {idade} não se encaixa em nenhuma faixa etária definida.")

    return contagem_sexo_faixa_etaria

@app.route("/mortalidade/<ano>")
def mortalidade(ano):
    df = load_data(ano)

    numero_obitos = df[df.dt_obito.notna()].shape[0]
    numero_casos = df.shape[0]

    if numero_casos > 0:
        taxa_letalidade = (numero_obitos / numero_casos) * 100
    else:
        taxa_letalidade = 0

    response = {
        "numero_obitos": numero_obitos,
        "total_casos": numero_casos,
        "taxa_letalidade": taxa_letalidade
    }
    return jsonify(response)

@app.route("/evolucao_casos/<ano>")
def evolucao_casos(ano):
    df = load_data(ano)

    if df is None:
        return jsonify({"error": f"Dados para o ano {ano} não encontrados."}), 404

    evolucao_counts = df['tp_evolucao_caso'].value_counts().to_dict()

    evolucao_descricao = {
        1: "cura",
        2: "óbito por dengue",
        3: "óbito por outras causas",
        4: "óbito em investigação",
        9: "ignorado"
    }

    evolucao_casos = {evolucao_descricao.get(k, "desconhecido"): v for k, v in evolucao_counts.items()}

    return jsonify(evolucao_casos)

def calcular_evolucao_casos(df):
    evolucao_counts = df['tp_evolucao_caso'].value_counts().to_dict()

    evolucao_descricao = {
        1: "cura",
        2: "óbito por dengue",
        3: "óbito por outras causas",
        4: "óbito em investigação",
        9: "ignorado"
    }

    return {evolucao_descricao.get(k, "desconhecido"): v for k, v in evolucao_counts.items()}

@app.route('/contagem_sinais_clinicos/<ano>')
def contagem_sinais_clinicos(ano):
    df = load_data(ano)

    sinais_clinicos = [
        "febre", "mialgia", "cefaleia", "exantema", "vomito",
        "nausea", "dor_costas", "conjutivite", "artrite",
        "artralgia", "petequia_n", "leucopenia", "laco",
        "dor_retro", "diabetes", "hematolog", "hepatopat",
        "renal", "hipertensao", "acido_pept", "auto_imune"
    ]

    contagem_sinais = {coluna: 0 for coluna in sinais_clinicos}

    for index, row in df.iterrows():
        for coluna in sinais_clinicos:
            if row[coluna] == 1:
                contagem_sinais[coluna] += 1

    response = {
        "contagem_sinais_clinicos": contagem_sinais
    }

    return jsonify(response)

@app.route("/comparar_anos/<ano1>/<ano2>")
def comparar_anos(ano1, ano2):
    df1 = load_data(ano1)
    df2 = load_data(ano2)

    media_idade_ano1 = df1.idade_modificada.astype(int).mean()
    contagem_bairro_ano1 = df1.no_bairro_residencia.value_counts().to_dict()
    contagem_data_ano1 = df1.dt_notificacao.value_counts().sort_index(ascending=True).to_dict()
    contagem_sexo_faixa_etaria_ano1 = calcular_contagem_sexo_faixa_etaria(df1)
    casos_homens_ano1 = len(df1[df1.tp_sexo == "M"])
    casos_mulheres_ano1 = len(df1[df1.tp_sexo == "F"])
    numero_obitos_ano1 = df1[df1.dt_obito.notna()].shape[0]
    numero_casos_ano1 = df1.shape[0]
    taxa_letalidade_ano1 = (numero_obitos_ano1 / numero_casos_ano1) * 100 if numero_casos_ano1 > 0 else 0
    contagem_evolucao_casos_ano1 = calcular_evolucao_casos(df1)

    media_idade_ano2 = df2.idade_modificada.astype(int).mean()
    contagem_bairro_ano2 = df2.no_bairro_residencia.value_counts().to_dict()
    contagem_data_ano2 = df2.dt_notificacao.value_counts().sort_index(ascending=True).to_dict()
    contagem_sexo_faixa_etaria_ano2 = calcular_contagem_sexo_faixa_etaria(df2)
    casos_homens_ano2 = len(df2[df2.tp_sexo == "M"])
    casos_mulheres_ano2 = len(df2[df2.tp_sexo == "F"])
    numero_obitos_ano2 = df2[df2.dt_obito.notna()].shape[0]
    numero_casos_ano2 = df2.shape[0]
    taxa_letalidade_ano2 = (numero_obitos_ano2 / numero_casos_ano2) * 100 if numero_casos_ano2 > 0 else 0
    contagem_evolucao_casos_ano2 = calcular_evolucao_casos(df2)

    response = {
        ano1: {
            "media_idade": media_idade_ano1,
            "contagem_bairro": contagem_bairro_ano1,
            "contagem_data": contagem_data_ano1,
            "contagem_sexo_faixa_etaria": contagem_sexo_faixa_etaria_ano1,
            "casos_homens": casos_homens_ano1,
            "casos_mulheres": casos_mulheres_ano1,
            "numero_obitos": numero_obitos_ano1,
            "total_casos": numero_casos_ano1,
            "taxa_letalidade": taxa_letalidade_ano1,
            "contagem_evolucao_casos": contagem_evolucao_casos_ano1
        },
        ano2: {
            "media_idade": media_idade_ano2,
            "contagem_bairro": contagem_bairro_ano2,
            "contagem_data": contagem_data_ano2,
            "contagem_sexo_faixa_etaria": contagem_sexo_faixa_etaria_ano2,
            "casos_homens": casos_homens_ano2,
            "casos_mulheres": casos_mulheres_ano2,
            "numero_obitos": numero_obitos_ano2,
            "total_casos": numero_casos_ano2,
            "taxa_letalidade": taxa_letalidade_ano2,
            "contagem_evolucao_casos": contagem_evolucao_casos_ano2
        }
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)