data_array = []
label_array = []
color_array = []

for (let i = 31; i < 59; i++) {
    if (crayola_colors[i]["Hexadecimal in their website depiction[lower-alpha 2]"].slice(0,7)){
        var hex_color = crayola_colors[i]["Hexadecimal in their website depiction[lower-alpha 2]"].slice(0,7)
        var obj = {
            x: chroma(hex_color).rgb()[0],
            y: chroma(hex_color).rgb()[2]
        }
        data_array.push(obj)
        label_array.push(crayola_colors[i].Name)
        color_array.push(hex_color)
    }
}

const crayonDrawer = document.getElementById('crayondrawer');
/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
 function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function setLargeName(index) {
    bigname = document.querySelector('#crayonname');
    var text_to_change = bigname.childNodes[0];
    text_to_change.nodeValue = label_array[index]
}

for (let i = 31; i < 59; i++) {
    if (crayola_colors[i]["Hexadecimal in their website depiction[lower-alpha 2]"].slice(0,7)){
        var d = document.createElement('div')
        var crayonName = crayola_colors[i].Name
        var hex_color = crayola_colors[i]["Hexadecimal in their website depiction[lower-alpha 2]"].slice(0,7)
        console.log(i, hex_color, chroma(hex_color).rgb()[0], )
        /* create the crayons */
        e = htmlToElement('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M394.102,0.004L31.962,362.144l12.693,12.693L3.081,462.738c-3.774,8.111-6.525,25.471,7.091,39.092c7.698,7.701,16.592,10.167,24.353,10.167c5.97,0,11.269-1.46,14.837-3.121l87.804-41.527l12.692,12.692L512,117.9L394.102,0.004zM33.458,476.525c-0.079,0.187-0.143,0.302-0.176,0.372L33.458,476.525z M35.195,478.679c-0.011,0.003-0.858,0.145-1.434-0.432c-0.255-0.255-0.634-0.635-0.254-1.823l36.198-76.536l42.412,42.412L35.195,478.679z M149.858,432.87l-70.725-70.725l17.348-17.348l70.725,70.725L149.858,432.87z M190.792,391.936l-70.725-70.725l231.76-231.76l70.725,70.726L190.792,391.936zM375.412,65.865l18.69-18.69l70.726,70.725l-18.691,18.691L375.412,65.865z"/></g></g></svg>');
        e.style.fill = hex_color
        e.setAttribute("transform", "rotate(135)");
        d.style.width = '100%'
        d.appendChild(e)
        d.className = 'crayon'

        crayonDrawer.appendChild(d)
    }
}

let crayonArray = document.getElementsByClassName("crayon");

function bindClick(i) {
    return function() {
        setLargeName(i)
    };
}

for(var i = 0; i < crayonArray.length; i++) {
    crayonArray[i].addEventListener("click", bindClick(i));
}


const data = {
    datasets: [{
      label: 'Green Crayon Colors',
      labels: label_array,
      data: data_array,
      pointRadius: 20,
      backgroundColor: color_array
    }]
}

const config = {
    type: 'scatter',
    data: data,
    options: { 
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(ctx) {
                        // console.log(ctx);
                        let label = ctx.dataset.labels[ctx.dataIndex];
                        label += " (" + ctx.parsed.x + ", " + ctx.parsed.y + ")";
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Amount of Blue',
                  }
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Amount of Red'
                  }
            }
        }}
  };

const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );