let ctx_idade = document.getElementById('graf_idade');
let ctx_bairro = document.getElementById('graf_bairro')
let year_select = document.getElementById('year-select')

function atualizar_graficos(ano) {
  //Por sexo
  fetch('http://127.0.0.1:5000/contagem_sexo/' + ano)
  .then(r => r.json())
  .then(dados => {
    const new_data = {
      labels: ['Homens', 'Mulheres'],
      datasets: [{
        label: 'Quantidade de Notificações por Sexo em ' + ano,
        data: [dados["casos_homens"],dados["casos_mulheres"]],
        borderWidth: 1
      }]
    }
    graf_idade.data = new_data
    graf_idade.update()
  })

  //Por bairro
  fetch('http://127.0.0.1:5000/contagem_bairro/' + ano)
  .then(r => r.json())
  .then(dados => {
    let titulos = []
    let numeros = []
    for (const dado in dados) {
      titulos.push(dado)
      numeros.push(dados[dado])
    }
    const new_data = {
      labels: titulos,
      datasets: [{
        label: 'Quantidade de Notificações Por Bairro em ' + ano,
        data: numeros,
        borderWidth: 1
      }]
    }
    graf_bairro.data = new_data
    graf_bairro.update()
  })
}

let graf_idade = new Chart(ctx_idade, {
  type: 'doughnut',
  data: [],
  options: {
    responsive: true,
  }
});

let graf_bairro = new Chart(ctx_bairro, {
  type: 'bar',
  data: [],
  options: {
    responsive: true,
  }
});

year_select.addEventListener('change', (e) => {
  atualizar_graficos(e.target.value)
})

atualizar_graficos(2017)


// function grafico_sexo() {
//   fetch('http://127.0.0.1:5000/contagem_sexo')
//   .then(r => r.json())
//   .then(dados => {
//     console.log(dados)

//     for (const dado in dados) {
//       console.log(dado)
//     }

//     new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Homens', 'Mulheres'],
//         datasets: [{
//           label: 'Quantidade de Notificações',
//           data: [dados["casos_homens"], dados["casos_mulheres"]],
//           borderWidth: 1
//         }]
//       },
//     });
//   })
// }

// grafico_sexo()