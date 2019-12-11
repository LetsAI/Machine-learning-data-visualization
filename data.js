// specifying  the neural network shape and parameters
const defults = {
    inputs: 6,
    outputs:2,
    Udebug: true,
    epochs: 30,
    layers: [
        ml5.tf.layers.dense({
            units: 16,
            inputShape: [6],
            activation: 'relu',
        }),
        ml5.tf.layers.dense({
            units: 16,
            activation: 'sigmoid',
        }),
        ml5.tf.layers.dense({
            units: 2,
            activation: 'sigmoid',
        })
    ],
    // hiddenUnits:1,
    // task: 'regression',
    learningRate: 0.001,
    activationHidden: 'tanh',
    activationOutput: 'sigmoid',
}
var neuralNetwork = 0
// Initialize the the neural network
neuralNetwork = ml5.neuralNetwork(defults);

// Adding some data
for (i =0; i<1000;i++){
x = i;
y = i+2;
z = i*2;
w = i-1;
e = i*(-1);
t = i-1;

// Adding The expected output 
o1 = i+(i*-2);
o2 = i+(i-1);
    neuralNetwork.data.addData( [x,y,z,w,e,t], [o1,o2])
}

// Normalize your data
neuralNetwork.data.normalize();

// Train the model with two callback functions (whileTraining, finish)
// Please note that the "finish" callback function will not return anything unless the training is done
// The whileTraining callback function is to visualise the data while training
neuralNetwork.train(whileTraining,finish);



///////////////////////////////////// The visualisation part using CanvasJS ///////////////////////

var dps = [];
var chart = new CanvasJS.Chart("chart_div", {
    width: 500,
    zoomEnabled: true,
    theme: "light",
    exportEnabled: true,
    title :{
        text: "Training Performance",
        fontColor:"gray",
        fontSize: 16,
    },
    // The X axis properties
    axisX: {
        title:"Epochs",
        includeZero: true,
        labelFontColor:"brown",
        titleFontSize: 16,
        titleFontStyle: "italic",
    },
    // The Y axis properties
    axisY: {
        title:"Loss",
        includeZero: true,
        lineColor: "black",
        labelFontColor:"brown",
        margin:10,
        titleFontSize: 16,
        titleFontStyle: "italic",
    },
    
    legend: {
        cursor:"poiner",
        fontSize: 14,
        fontColor: "dimGrey",
    },
    
    data: [{
        // showInLegend: true, 
        // legendText: "Loss",
        type: "spline",
        dataPoints: dps, /// Adding the chart properties
       
       // markerSize: 4,
    }]
});

var xVal = 0;
var yVal = 0; 
var dataLength = 100; // number of dataPoints visible at any point

// Here is the place where the data get updated according to the callback function values 
function whileTraining(epoch, loss){

    var updateChart = function (count) {
    
        count = count || 1;
        xVal = epoch;
        yVal = loss.loss*100;
    
            dps.push({
                x: xVal,
                y: yVal
            });
          
        chart.render();
    };

    updateChart(dataLength);
}

// when it is done training, run the prediction
function finish(){

    const 
        input0 = 234,
        input1 = 236,
        input2 = 468,
        input3 = 233,
        input4 = -234,
        input5 = 233;

    neuralNetwork.predict( [input0, input1 ,input2 ,input3 ,input4 ,input5], (err, results) => {
        document.getElementById('show_results').innerHTML = results[0].label + " : " + results[0].value + "<br>"
         +results[1].label + " : " + results[1].value ;
    })
    
}
// Download the model and the data
function bt(){
    neuralNetwork.saveData();
    neuralNetwork.save(finish);

}
