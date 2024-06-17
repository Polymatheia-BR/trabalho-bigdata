document.addEventListener('DOMContentLoaded', function() {
  let ctx_sexo = document.getElementById('graf_sexo');
  let ctx_faixa_etaria = document.getElementById('graf_faixa_etaria');
  let ctx_bairro = document.getElementById('graf_bairro');
  let ctx_mortalidade = document.getElementById('graf_mortalidade');
  let ctx_evolucao = document.getElementById('graf_evolucao'); 
  let ctx_sinais_clinicos = document.getElementById('graf_sinais_clinicos');
  let ctx_dados_meteorologicos = document.getElementById('grafico_meteorologico').getContext('2d');
  let ctx_padroes_vento = document.getElementById('graf_padroes_vento');
  let year_select_1 = document.getElementById('year-select-1');
  let year_select_2 = document.getElementById('year-select-2');

  function getMonthName(monthNumber) {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return monthNames[monthNumber - 1];
}

  if (!ctx_sexo || !ctx_faixa_etaria || !ctx_bairro || !ctx_mortalidade || !ctx_evolucao || !ctx_sinais_clinicos || !ctx_dados_meteorologicos || !ctx_padroes_vento) {
    console.error('Erro: Elemento <canvas> não encontrado.');
    return;
  }

  let graf_sexo = new Chart(ctx_sexo, {
    type: 'doughnut',
    data: [],
    options: {
      responsive: true,
      plugins: {
        title: {
            display: true,
            text: 'Notificações por Sexo',
            font: {
                size: 18,
                weight: 'bold'
            },
            color: '#333'
        }
      }
    }});

  let graf_faixa_etaria = new Chart(ctx_faixa_etaria, {
    type: 'doughnut',
    data: [],
    options: {
      responsive: true,
      plugins: {
        title: {
            display: true,
            text: 'Notificações por Faixa Etaria',
            font: {
                size: 18,
                weight: 'bold'
            },
            color: '#333'
        }
      }
  }});

  let graf_bairro = new Chart(ctx_bairro, {
    type: 'bar',
    data: [],
    options: {
      responsive: true,
      plugins: {
        title: {
            display: true,
            text: 'Notificações por Bairro',
            font: {
                size: 18,
                weight: 'bold'
            },
            color: '#333'
        }
      }
    }});

  let graf_mortalidade = new Chart(ctx_mortalidade, {
    type: 'doughnut',
    data: [],
    options: {
      responsive: true,
      plugins: {
        title: {
            display: true,
            text: 'Dados de Mortalidade',
            font: {
                size: 18,
                weight: 'bold'
            },
            color: '#333'
        }
      }
    }});

  let graf_evolucao = new Chart(ctx_evolucao, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontColor: '#333'
                }
            }
        },
        scales: {
            x: {
                type: 'category',
                scaleLabel: {
                    display: true,
                    labelString: 'Descrição',
                    fontColor: '#333',
                    fontSize: 16
                },
                ticks: {
                    fontColor: '#333'
                }
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Número de Casos',
                    fontColor: '#333',
                    fontSize: 16
                },
                ticks: {
                    fontColor: '#333',
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Evolução dos Casos',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                color: '#333'
            }
        },
        elements: {
            line: {
                borderColor: 'rgba(75, 192, 192, 0.8)',
                borderWidth: 2
            }
        }
    }
});

let graf_sinais_clinicos = new Chart(ctx_sinais_clinicos, {
  type: 'bar',
  data: {
      labels: [],
      datasets: [{
          label: [],
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      }]
  },
  options: {
      scales: {
          y: {
              beginAtZero: true,
              precision: 0
          }
      }
  }
});

let grafico_meteorologico = new Chart(ctx_dados_meteorologicos, {
  type: 'line',
  label: [],
  data: [],
  options: {
      responsive: true,
      interaction: {
          mode: 'index',
          intersect: false
      },
      stacked: false,
      plugins: {
          tooltip: {
              mode: 'index',
              intersect: false
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              position: 'left',
              title: {
                  display: true,
                  text: 'Valores'
              }
          },
          'y-precipitacao': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Precipitação (mm)'
              }
          },
          'y-pressao': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Pressão (milibares)'
              }
          },
          'y-rad': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Radiação Global (kJ/m²)'
              }
          },
          'y-temp': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Temperatura (°C)'
              }
          },
          'y-umid': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Umidade Relativa (%)'
              }
          },
          'y-vento': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                  display: true,
                  text: 'Velocidade do Vento (m/s)'
              }
          }
      }
  }
});

let graf_padroes_vento = new Chart(ctx_padroes_vento, {
  type: 'radar',
  data: {
      labels: ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'],
      datasets: [{
          label: 'Padrões do vento',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
      }]
  },
  options: {
      responsive: true,
      plugins: {
          tooltip: {
              callbacks: {
                  label: function(context) {
                      return context.dataset.label || '';
                  }
              }
          }
      },
      scale: {
          ticks: {
              beginAtZero: true,
              min: 0,
              max: 10,
              stepSize: 1
          }
      }
  }
});


  function atualizar_grafico_sexo(ano) {
    fetch(`http://127.0.0.1:5000/contagem_sexo/${ano}`)
      .then(r => r.json())
      .then(dados => {
        const new_data = {
          labels: ['Homens', 'Mulheres'],
          datasets: [{
            label: 'Quantidade de Notificações por Sexo em ' + ano,
            data: [dados["casos_homens"], dados["casos_mulheres"]],
            backgroundColor: ['#FF6347', '#36A2EB'],
            borderWidth: 1
          }]
        }
        graf_sexo.data = new_data;
        graf_sexo.update();
      });
  }

  function atualizar_grafico_idade(ano) {
    fetch(`http://127.0.0.1:5000/contagem_sexo_faixa_etaria/${ano}`)
      .then(r => r.json())
      .then(dados => {
        const faixas_etarias = Object.keys(dados.contagem_sexo_faixa_etaria);
        const dados_homem = faixas_etarias.map(faixa => dados.contagem_sexo_faixa_etaria[faixa]["M"]);
        const dados_mulher = faixas_etarias.map(faixa => dados.contagem_sexo_faixa_etaria[faixa]["F"]);

        const new_data = {
          labels: faixas_etarias,
          datasets: [{
            label: 'Quantidade de Notificações por Faixa Etária - Homens',
            data: dados_homem,
            backgroundColor: '#FF6347',
            borderWidth: 1
          }, {
            label: 'Quantidade de Notificações por Faixa Etária - Mulheres',
            data: dados_mulher,
            backgroundColor: '#4682B4',
            borderWidth: 1
          }]
        }
        graf_faixa_etaria.data = new_data;
        graf_faixa_etaria.update();
      });
  }

  function atualizar_grafico_bairro(ano) {
    fetch(`http://127.0.0.1:5000/contagem_bairro/${ano}`)
      .then(r => r.json())
      .then(dados => {
        let titulos = [];
        let numeros = [];
        for (const dado in dados) {
          titulos.push(dado);
          numeros.push(dados[dado]);
        }
        const new_data = {
          labels: titulos,
          datasets: [{
            label: 'Quantidade de Notificações Por Bairro em ' + ano,
            data: numeros,
            backgroundColor: '#FF6347',
            borderWidth: 1
          }]
        }
        graf_bairro.data = new_data;
        graf_bairro.update();
      });
  }

  function atualizar_grafico_mortalidade(ano) {
    fetch(`http://127.0.0.1:5000/mortalidade/${ano}`)
      .then(r => r.json())
      .then(dados => {
        let numero_obitos = dados["numero_obitos"];
        let total_casos = dados["total_casos"];

        const new_data = {
          labels: ['Óbitos', 'Casos sem Óbito'],
          datasets: [{
            label: 'Mortalidade Relacionada à Dengue em ' + ano,
            data: [numero_obitos, (total_casos - numero_obitos)],
            backgroundColor: ['#FF6347', '#36A2EB'],
            borderWidth: 1
          }]
        }
        graf_mortalidade.data = new_data;
        graf_mortalidade.update();
      });
  }

  function atualizar_grafico_evolucao(ano) {
    fetch(`http://127.0.0.1:5000/evolucao_casos/${ano}`)
      .then(r => r.json())
      .then(dados => {
        const labels = Object.keys(dados);
        const data = Object.values(dados);
  
        const new_data = {
          labels: labels,
          datasets: [{
            label: 'Evolução de Casos de Dengue em ' + ano,
            data: data,
            backgroundColor: ['#FF6347', '#36A2EB', '#FFA07A', '#4682B4', '#8A2BE2'],
            borderWidth: 1
          }]
        };
  
        graf_evolucao.data = new_data;
        graf_evolucao.update();
      });
  } 

  function atualizar_grafico_sinais_clinicos(ano) {
    fetch(`http://127.0.0.1:5000/contagem_sinais_clinicos/${ano}`)
        .then(r => r.json())
        .then(data => {
            const sinaisClinicos = Object.keys(data.contagem_sinais_clinicos);
            const contagens = Object.values(data.contagem_sinais_clinicos);

            const new_data = {
                labels: sinaisClinicos,
                datasets: [{
                    label: `Contagem de Sinais Clínicos (${ano})`,
                    data: contagens,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
             };
            graf_sinais_clinicos.data = new_data;
            graf_sinais_clinicos.update();
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
  } 

  function atualizar_grafico_meteorologico(ano) {
    fetch(`http://127.0.0.1:5000/dados_meteorologicos/${ano}`)
    .then(r => r.json())
    .then(data => {
        const labels = data.month.map(month => getMonthName(month));
        const new_data = {
            labels: labels,
            datasets: [{
                label: 'Precipitação (mm)',
                data: data.precipitacao,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y-precipitacao'
            },
            {
                label: 'Pressão (milibares)',
                data: data.press,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-pressao'
            },
            {
                label: 'Radiação Global (kJ/m²)',
                data: data.rad,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y-rad'
            },
            {
                label: 'Temperatura (°C)',
                data: data.temp,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                yAxisID: 'y-temp'
            },
            {
                label: 'Umidade Relativa (%)',
                data: data.umid,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                yAxisID: 'y-umid'
            },
            {
                label: 'Velocidade do Vento (m/s)',
                data: data.vento,
                borderColor: 'rgba(78, 115, 223, 1)',
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                yAxisID: 'y-vento'
            }]
        };
        grafico_meteorologico.data = new_data;
        grafico_meteorologico.update();

    });
  }

  function atualizar_grafico_padroes_vento(ano) {
    fetch(`http://127.0.0.1:5000/padroes_vento/${ano}`)
        .then(r => r.json())
        .then(data => {
            const padroes_vento = data.padroes_vento;
            const grupos = {
                'N': [],
                'NE': [],
                'L': [],
                'SE': [],
                'S': [],
                'SO': [],
                'O': [],
                'NO': []
            };

            Object.keys(padroes_vento).forEach(padr => {
                const grau = parseFloat(padr);
                if (grau >= 337.5 || grau < 22.5) {
                    grupos['N'].push(padroes_vento[padr]);
                } else if (grau >= 22.5 && grau < 67.5) {
                    grupos['NE'].push(padroes_vento[padr]);
                } else if (grau >= 67.5 && grau < 112.5) {
                    grupos['L'].push(padroes_vento[padr]);
                } else if (grau >= 112.5 && grau < 157.5) {
                    grupos['SE'].push(padroes_vento[padr]);
                } else if (grau >= 157.5 && grau < 202.5) {
                    grupos['S'].push(padroes_vento[padr]);
                } else if (grau >= 202.5 && grau < 247.5) {
                    grupos['SO'].push(padroes_vento[padr]);
                } else if (grau >= 247.5 && grau < 292.5) {
                    grupos['O'].push(padroes_vento[padr]);
                } else if (grau >= 292.5 && grau < 337.5) {
                    grupos['NO'].push(padroes_vento[padr]);
                }
            });

            const dados = Object.values(grupos).map(grupo => {
                if (grupo.length === 0) return 0;
                const soma = grupo.reduce((acc, curr) => acc + curr);
                return soma / grupo.length;
            });

            graf_padroes_vento.data.datasets[0].data = dados;
            graf_padroes_vento.update();
        })
        .catch(error => {
            console.error('Erro ao buscar dados de padrões de vento:', error);
        });
  }

  function atualizar_graficos(ano) {
    atualizar_grafico_sexo(ano);
    atualizar_grafico_idade(ano);
    atualizar_grafico_bairro(ano);
    atualizar_grafico_mortalidade(ano);
    atualizar_grafico_evolucao(ano);
    atualizar_grafico_sinais_clinicos(ano);
    atualizar_grafico_meteorologico(ano);
    atualizar_grafico_padroes_vento(ano);
  }

  function atualizar_graficos_comparacao(ano1, ano2) {
    // Atualizar gráfico de idade por sexo para os dois anos
    fetch(`http://127.0.0.1:5000/comparar_anos/${ano1}/${ano2}`)
      .then(r => r.json())
      .then(dados => {
        const new_data = {
          labels: ['Homens', 'Mulheres'],
          datasets: [{
            label: `Quantidade de Notificações por Sexo em ${ano1}`,
            data: [dados[ano1]["casos_homens"], dados[ano1]["casos_mulheres"]],
            backgroundColor: ['#FF6347', '#36A2EB'],
            borderWidth: 1
          }, {
            label: `Quantidade de Notificações por Sexo em ${ano2}`,
            data: [dados[ano2]["casos_homens"], dados[ano2]["casos_mulheres"]],
            backgroundColor: ['#FFA07A', '#4682B4'],
            borderWidth: 1
          }]
        };
        graf_sexo.data = new_data;
        graf_sexo.update();
      });

      // Atualizar gráfico de faixa etária para os dois anos
    fetch(`http://127.0.0.1:5000/contagem_sexo_faixa_etaria/${ano1}`)
    .then(r => r.json())
    .then(dados1 => {
      fetch(`http://127.0.0.1:5000/contagem_sexo_faixa_etaria/${ano2}`)
        .then(r => r.json())
        .then(dados2 => {
          const faixas = Object.keys(dados1.contagem_sexo_faixa_etaria);

          const dados_ano1 = faixas.map(faixa => dados1.contagem_sexo_faixa_etaria[faixa]);
          const dados_ano2 = faixas.map(faixa => dados2.contagem_sexo_faixa_etaria[faixa]);

          const new_data_faixa_etaria = {
            labels: faixas,
            datasets: [{
              label: `Quantidade de Notificações Por Faixa Etária em ${ano1}`,
              data: dados_ano1.map(dados => dados["M"] + dados["F"]),
              backgroundColor: '#FF6347',
              borderWidth: 1
            }, {
              label: `Quantidade de Notificações Por Faixa Etária em ${ano2}`,
              data: dados_ano2.map(dados => dados["M"] + dados["F"]),
              backgroundColor: '#4682B4',
              borderWidth: 1
            }]
          };
          graf_faixa_etaria.data = new_data_faixa_etaria;
          graf_faixa_etaria.update();
        });
    });

    // Atualizar gráfico de bairro para os dois anos
    fetch(`http://127.0.0.1:5000/comparar_anos/${ano1}/${ano2}`)
      .then(r => r.json())
      .then(dados => {
        const titulos = Object.keys(dados[ano1]["contagem_bairro"]);
        const numeros_ano1 = titulos.map(bairro => dados[ano1]["contagem_bairro"][bairro] || 0);
        const numeros_ano2 = titulos.map(bairro => dados[ano2]["contagem_bairro"][bairro] || 0);

        const new_data = {
          labels: titulos,
          datasets: [{
            label: `Quantidade de Notificações Por Bairro em ${ano1}`,
            data: numeros_ano1,
            backgroundColor: '#FF6347',
            borderWidth: 1
          }, {
            label: `Quantidade de Notificações Por Bairro em ${ano2}`,
            data: numeros_ano2,
            backgroundColor: '#4682B4',
            borderWidth: 1
          }]
        };
        graf_bairro.data = new_data;
        graf_bairro.update();
      });

    // Atualizar gráfico de mortalidade para os dois anos
    fetch(`http://127.0.0.1:5000/comparar_anos/${ano1}/${ano2}`)
      .then(r => r.json())
      .then(dados => {
        const numero_obitos_ano1 = dados[ano1]["numero_obitos"];
        const total_casos_ano1 = dados[ano1]["total_casos"];
        const numero_obitos_ano2 = dados[ano2]["numero_obitos"];
        const total_casos_ano2 = dados[ano2]["total_casos"];

        const new_data = {
          labels: ['Óbitos', 'Casos sem Óbito'],
          datasets: [{
            label: `Mortalidade Relacionada à Dengue em ${ano1}`,
            data: [numero_obitos_ano1, (total_casos_ano1 - numero_obitos_ano1)],
            backgroundColor: ['#FF6347', '#36A2EB'],
            borderWidth: 1
          }, {
            label: `Mortalidade Relacionada à Dengue em ${ano2}`,
            data: [numero_obitos_ano2, (total_casos_ano2 - numero_obitos_ano2)],
            backgroundColor: ['#FFA07A', '#4682B4'],
            borderWidth: 1
          }]
        };
        graf_mortalidade.data = new_data;
        graf_mortalidade.update();
      });
  
      // Atualizar gráfico de evolução de casos para os dois anos
    fetch(`http://127.0.0.1:5000/evolucao_casos/${ano1}`)
      .then(r => r.json())
      .then(dados1 => {
        fetch(`http://127.0.0.1:5000/evolucao_casos/${ano2}`)
          .then(r => r.json())
          .then(dados2 => {
            const evolucoes = Object.keys(dados1).concat(Object.keys(dados2));
            const evolucaoLabels = [...new Set(evolucoes)];
  
            const data_ano1 = evolucaoLabels.map(label => dados1[label] || 0);
            const data_ano2 = evolucaoLabels.map(label => dados2[label] || 0);
  
            const new_data = {
              labels: evolucaoLabels,
              datasets: [{
                label: `Evolução de Casos de Dengue em ${ano1}`,
                data: data_ano1,
                backgroundColor: '#FF6347',
                borderWidth: 1
              }, {
                label: `Evolução de Casos de Dengue em ${ano2}`,
                data: data_ano2,
                backgroundColor: '#4682B4',
                borderWidth: 1
              }]
            };
  
            graf_evolucao.data = new_data;
            graf_evolucao.update();
          });
      });

      // Atualizar gráfico de sinais clínicos para os dois anos
    fetch(`http://127.0.0.1:5000/contagem_sinais_clinicos/${ano1}`)
      .then(r => r.json())
      .then(dados1 => {
        fetch(`http://127.0.0.1:5000/contagem_sinais_clinicos/${ano2}`)
          .then(r => r.json())
          .then(dados2 => {
            const sinaisClinicos = Object.keys(dados1.contagem_sinais_clinicos);
            const contagens_ano1 = sinaisClinicos.map(sinal => dados1.contagem_sinais_clinicos[sinal]);
            const contagens_ano2 = sinaisClinicos.map(sinal => dados2.contagem_sinais_clinicos[sinal]);

            const new_data_sinais_clinicos = {
              labels: sinaisClinicos,
              datasets: [{
                label: `Contagem de Sinais Clínicos em ${ano1}`,
                data: contagens_ano1,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }, {
                label: `Contagem de Sinais Clínicos em ${ano2}`,
                data: contagens_ano2,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }]
            };

            graf_sinais_clinicos.data = new_data_sinais_clinicos;
            graf_sinais_clinicos.update();
          });
      })
      .catch(error => {
        console.error('Erro ao buscar dados de sinais clínicos:', error);
      });

    // Atualizar gráfico meteorológico para os dois anos
      fetch(`http://127.0.0.1:5000/dados_meteorologicos/${ano1}`)
      .then(r => r.json())
      .then(data1 => {
        fetch(`http://127.0.0.1:5000/dados_meteorologicos/${ano2}`)
        .then(response => response.json())
        .then(data2 => {
          const labels = data1.month.map(month => getMonthName(month));
          const new_data = {
            labels: labels,
            datasets: [{
              label: `Precipitação (${ano1})`,
              data: data1.precipitacao,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              yAxisID: 'y-precipitacao'
            },
            {
              label: `Precipitação (${ano2})`,
              data: data2.precipitacao,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-precipitacao'
            },
            {
              label: `Pressão (${ano1})`,
              data: data1.press,
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              yAxisID: 'y-pressao'
            },
            {
              label: `Pressão (${ano2})`,
              data: data2.press,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              yAxisID: 'y-pressao'
            },
            {
              label: `Radiação Global (${ano1})`,
              data: data1.rad,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              yAxisID: 'y-rad'
            },
            {
              label: `Radiação Global (${ano2})`,
              data: data2.rad,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-rad'
          },
          {
              label: `Temperatura (${ano1})`,
              data: data1.temp,
              borderColor: 'rgba(78, 115, 223, 1)',
              backgroundColor: 'rgba(78, 115, 223, 0.2)',
              yAxisID: 'y-temp'
          },
          {
              label: `Temperatura (${ano2})`,
              data: data2.temp,
              borderColor: 'rgba(255, 205, 86, 1)',
              backgroundColor: 'rgba(255, 205, 86, 0.2)',
              yAxisID: 'y-temp'
          },
          {
              label: `Umidade Relativa (${ano1})`,
              data: data1.umid,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              yAxisID: 'y-umid'
          },
          {
              label: `Umidade Relativa (${ano2})`,
              data: data2.umid,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-umid'
          },
          {
              label: `Velocidade do Vento (${ano1})`,
              data: data1.vento,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              yAxisID: 'y-vento'
          },
          {
              label: `Velocidade do Vento (${ano2})`,
              data: data2.vento,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              yAxisID: 'y-vento'
          }
        ]};
          grafico_meteorologico.data = new_data;
          grafico_meteorologico.update();
          })
          .catch(error => {
            console.error('Erro ao buscar dados meteorológicos:', error);
          });
        })
        .catch(error => {
          console.error('Erro ao buscar dados meteorológicos:', error);
        });

        // Atualizar gráfico de padrões de vento para os dois anos
      fetch(`http://127.0.0.1:5000/padroes_vento/${ano1}`)
      .then(r => r.json())
      .then(data1 => {
          fetch(`http://127.0.0.1:5000/padroes_vento/${ano2}`)
              .then(response => response.json())
              .then(data2 => {
                  const padroes_vento1 = data1.padroes_vento;
                  const padroes_vento2 = data2.padroes_vento;
                  const grupos1 = {
                      'N': [], 'NE': [], 'L': [], 'SE': [], 'S': [], 'SO': [], 'O': [], 'NO': []
                  };
                  const grupos2 = {
                      'N': [], 'NE': [], 'L': [], 'SE': [], 'S': [], 'SO': [], 'O': [], 'NO': []
                  };

                  const organizarGrupos = (padroes_vento, grupos) => {
                      Object.keys(padroes_vento).forEach(padr => {
                          const grau = parseFloat(padr);
                          if (grau >= 337.5 || grau < 22.5) {
                              grupos['N'].push(padroes_vento[padr]);
                          } else if (grau >= 22.5 && grau < 67.5) {
                              grupos['NE'].push(padroes_vento[padr]);
                          } else if (grau >= 67.5 && grau < 112.5) {
                              grupos['L'].push(padroes_vento[padr]);
                          } else if (grau >= 112.5 && grau < 157.5) {
                              grupos['SE'].push(padroes_vento[padr]);
                          } else if (grau >= 157.5 && grau < 202.5) {
                              grupos['S'].push(padroes_vento[padr]);
                          } else if (grau >= 202.5 && grau < 247.5) {
                              grupos['SO'].push(padroes_vento[padr]);
                          } else if (grau >= 247.5 && grau < 292.5) {
                              grupos['O'].push(padroes_vento[padr]);
                          } else if (grau >= 292.5 && grau < 337.5) {
                              grupos['NO'].push(padroes_vento[padr]);
                          }
                      });
                  };

                  organizarGrupos(padroes_vento1, grupos1);
                  organizarGrupos(padroes_vento2, grupos2);

                  const calcularMedia = (grupos) => {
                      return Object.values(grupos).map(grupo => {
                          if (grupo.length === 0) return 0;
                          const soma = grupo.reduce((acc, curr) => acc + curr, 0);
                          return soma / grupo.length;
                      });
                  };

                  const dados1 = calcularMedia(grupos1);
                  const dados2 = calcularMedia(grupos2);

                  const new_data_padroes_vento = {
                      labels: ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'],
                      datasets: [{
                          label: `Padrões de Vento em ${ano1}`,
                          data: dados1,
                          backgroundColor: '#FF6347',
                          borderWidth: 1
                      }, {
                          label: `Padrões de Vento em ${ano2}`,
                          data: dados2,
                          backgroundColor: '#4682B4',
                          borderWidth: 1
                      }]
                  };
                  graf_padroes_vento.data = new_data_padroes_vento;
                  graf_padroes_vento.update();
              })
              .catch(error => {
                  console.error('Erro ao buscar dados de padrões de vento para o segundo ano:', error);
              });
      })
      .catch(error => {
          console.error('Erro ao buscar dados de padrões de vento para o primeiro ano:', error);
      });
    }
  

  year_select_1.addEventListener('change', (e) => {
    const ano1 = e.target.value;
    const ano2 = year_select_2.value;
    if (ano1 !== ano2) {
      atualizar_graficos_comparacao(ano1, ano2);
    } else {
      atualizar_graficos(ano1);
    }
  });

  year_select_2.addEventListener('change', (e) => {
    const ano1 = year_select_1.value;
    const ano2 = e.target.value;
    if (ano1 !== ano2) {
      atualizar_graficos_comparacao(ano1, ano2);
    } else {
      atualizar_graficos(ano2);
    }
  });

  atualizar_graficos(2017);
});

