let countyUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;


let svg = d3.select("#canvas");
let tooltip = d3.select("#tooltip");


let drawMap = () => {
    svg.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
        let countyId = countyDataItem.id;
        let county = educationData.find((educationDataItem) => {
            return educationDataItem.fips === countyId;
        });
        let statistic = county.bachelorsOrHigher;
        if (statistic <= 5) {
            return 'powderblue';
        } else if (statistic <= 20) {
            return 'lightskyblue';
        } else if (statistic <= 35) {
            return 'deepskyblue';
        } else if (statistic <= 50) {
            return 'dodgerblue';
        } else if (statistic <= 65) {
            return 'blue';
        } else {
            return 'purple';
        }
            
    })
    .attr('data-fips', (countyDataItem) => {
        return countyDataItem.id;
    })
    .attr('data-education', (countyDataItem) => {
        let countyId = countyDataItem.id;
        let county = educationData.find((educationDataItem) => {
            return educationDataItem.fips === countyId;
        });
        return county.bachelorsOrHigher;
    })
    .on('mouseover', (countyDataItem) => {
        tooltip.transition()
        .style('visibility', 'visible')
        let countyId = countyDataItem.toElement.__data__.id;
        console.log(countyDataItem)
        let county = educationData.find((educationDataItem) => {
            return educationDataItem.fips === countyId;
        })  
        tooltip.text(county.area_name + ', ' + county.state + ': ' + county.bachelorsOrHigher + '%')
        .attr('data-education', county.bachelorsOrHigher)
    })
    .on('mouseout', (countyDataItem) => {
        tooltip.transition()
        .style('visibility', 'hidden')
    })


};

d3.json(countyUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationUrl).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;

        drawMap();
      }
    });
  }
});
