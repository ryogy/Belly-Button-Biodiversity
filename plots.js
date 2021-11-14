function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

// Creating optionChanged function
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

// Needs to isolate the samples based on id
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      samplesArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var desiredSample = samplesArray.filter(data => data.id == sample);
      console.log(desiredSample);
      //  5. Create a variable that holds the first sample in the array.
      firstSample = desiredSample[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
      console.log(otuIds);
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otuIds.slice(0, 10).map(id => "OTU:" + id).reverse();
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        type: "bar",
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        orientation: "h"
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout, {responsive: true});
    
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Blackbody"
        }
      }
      ];

      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        showlegend: false,
        hovermode: "closest"  
      };

      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 

      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadataSample = data.metadata.filter(data => data.id == sample);
      console.log(metadataSample);
      
      // 3. Create a variable that holds the washing frequency.
      washingFrequency = metadataSample[0].wfreq;

   
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFrequency,
          title: { text: "Belly Button Washing Frequency"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 10],
              tickvals: [0,2,4,6,8,10],
            },
            bar: {color: "black"},
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lime" },
              { range: [8, 10], color: "green" }]
          }
        }
      ];
      
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        autosize: true
      };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
});
}