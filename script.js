

  let socket = new WebSocket("ws://localhost:8765");

  socket.onmessage = function(event) {
      let printerData = JSON.parse(event.data);
      let printerStatusDiv = document.getElementById('printer_status');
      printerStatusDiv.innerHTML = "";

      printerData.forEach(function(printerInfo) {
          let printerDiv = document.createElement('div');
          let h2 = document.createElement('h2');
          h2.textContent = printerInfo.url;
          printerDiv.appendChild(h2);

          Object.keys(printerInfo).forEach(function(key) {
              if (key !== 'url') {
                  let p = document.createElement('p');
                  p.textContent = key + ": " + printerInfo[key];
                  printerDiv.appendChild(p);
              }
          });

          printerStatusDiv.appendChild(printerDiv);
      });
  };


  socket.onmessage = function(event) {
    let printerData = JSON.parse(event.data);

    printerData.forEach(function(printerInfo) {
        let ip = printerInfo.url.split("/")[2];

        let tonerStatus = document.querySelector(`p[data-ip="${ip}"][data-info="toner"]`);
        let bandejasStatus = document.querySelector(`p[data-ip="${ip}"][data-info="bandejas"]`);
        let kitManutencao = document.querySelector(`p[data-ip="${ip}"][data-info="kit_manutencao"]`);
        let kitRolo = document.querySelector(`p[data-ip="${ip}"][data-info="kit_rolo"]`);
        let unidImagem = document.querySelector(`p[data-ip="${ip}"][data-info="unid_imagem"]`);

        if (tonerStatus) {
            let tonerPercentage = parseInt(printerInfo.toner_status.match(/\d+/));
            tonerStatus.innerHTML = `Toner Status: <span class="${tonerPercentage < 10 ? "text-red" : "text-green"}">${tonerPercentage}%</span>`;
        }
        
        if (bandejasStatus) {
            bandejasStatus.innerHTML = `Bandejas Status: <span class="${printerInfo.bandejas_status === "OK" ? "text-green" : "text-red"}">${printerInfo.bandejas_status}</span>`;
        }
        
        if (kitManutencao) {
            let kitManutencaoPercentage = parseInt(printerInfo.kit_manutencao);
            kitManutencao.innerHTML = `Kit Manutenção: <span class="${kitManutencaoPercentage < 10 ? "text-red" : "text-green"}">${kitManutencaoPercentage}%</span>`;
        }
        
        if (kitRolo) {
            let kitRoloContent = (printerInfo.kit_rolo !== "" && printerInfo.kit_rolo !== "NaN") ? `${parseInt(printerInfo.kit_rolo)}%` : "NÃO TEM";
            kitRolo.innerHTML = `Kit Rolo: <span class="${kitRoloContent === "NÃO TEM" ? "text-red" : "text-green"}">${kitRoloContent}</span>`;
        }
        
        if (unidImagem) {
            let unidImagemPercentage = parseInt(printerInfo.unid_imagem);
            unidImagem.innerHTML = `Unidade de Imagem: <span class="${unidImagemPercentage < 10 ? "text-red" : "text-green"}">${unidImagemPercentage}%</span>`;
        }
    });
};
