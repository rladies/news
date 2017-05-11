var oReq = new XMLHttpRequest()
oReq.addEventListener("load", reqListener)
oReq.open("GET", "/api/v1/news")

oReq.send()

function sentimentBars(sentiment){

    if (sentiment < 0 ) return "rgba(255, 99, 132, 0.5)";
    if (sentiment > 0) return 'rgba(75, 192, 192, 0.5)';

    return 'rgba(255, 159, 64, 0.5)';

}


function stimateVisits (rawVisits) {
    var total = 0
    rawVisits.forEach(function(row){
        console.log(row)
        if(row.valores && row.valores.length === 60){
            total += parseInt(row.valores[59])
        }
    
    })
    return total;
}

function reqListener () {
    var data = JSON.parse(this.responseText);
    var texthtml = "";
    var titles = [];
    var backgroundColors = [];
    var borderColors = [];
    var numVis = [];
    for (var i = 0; i < data.length; i++) {
        titles.push(data[i].titulo);
        backgroundColors.push(sentimentBars(data[i].sentiment_value));
        borderColors.push('rgba(255,99,132,1)')
        numVis.push(stimateVisits(data[i].visitas));
    }
  
    var ctx = document.getElementById("myChart");

    var data = {
        labels: titles,
        datasets: [
            {
                label: "Visitas",
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                data: numVis,
            }
        ]
    };
    var myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data
    });

  //followersLabel.innerHTML = data.followers
}
