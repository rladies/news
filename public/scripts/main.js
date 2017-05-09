var oReq = new XMLHttpRequest()
oReq.addEventListener("load", reqListener)
  oReq.open("GET", "https://raw.githubusercontent.com/rladies/news/master/public/demo.json")
oReq.send()

// var title = document.getElementById('followers')
// var sentimiento = document.getElementById('followers')
// var visitasLabel = document.getElementById('followers')

// for (var i = 0; i < Things.length; i++) {
// 	Things[i]
// }

function sentimentBars(sentiment){
  if (sentiment <0.2 ) return "rgba(255, 99, 132, 0.2)";
  if (sentiment <0.8) return 'rgba(255, 159, 64, 0.2)';

  return 'rgba(75, 192, 192, 0.2)';
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
    backgroundColors.push(sentimentBars(data[i].sentimiento));
    borderColors.push('rgba(255,99,132,1)');
    numVis.push(data[i].visitas);

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
