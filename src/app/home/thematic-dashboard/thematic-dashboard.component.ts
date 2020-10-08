import { Component, OnInit, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3v4';
import * as topojson from 'topojson';
import { HomeService } from '../home.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-thematic-dashboard',
  templateUrl: './thematic-dashboard.component.html',
  styleUrls: ['./thematic-dashboard.component.scss'],
})
export class ThematicDashboardComponent implements OnInit {
  @Input()
  width;
  height;
  projection;
  path;
  svg;
  g: any;
  thematicData: any;
  // thematicDropDownList: any;
  dashboardLeftPanelData: any;
  legendData: any;
  ngContentId: any;
  selectedOption: any;
  mapData: any
  mapNameData: any;
  thematicKeys: any;
  clicks: number = 0;
  myDate :any;

  lineChartData: any;
  lineChartVisible: boolean = false;
  tabKeys: any;
  areaId: string;
  indicatorName: any;
  selectedTab: any;
  // indicatorValue:string;
  sideAreaName: any = 'Odisha';
  areaName: string;
  primary_url: any;
  isBackBtnClicked: boolean = false;
  areaLevelId: number;
  blockLevelView: boolean = false;
  selectedDistrict: any;
  blockLevelData: any
  tabSelect: any =0;

  constructor(private hostRef: ElementRef, private homeService: HomeService, private datePipe: DatePipe) {
    this.homeService = homeService;
  }

  ngOnInit() {
    this.areaId = 'IND021';
    this.myDate = this.datePipe.transform(new Date(),"MM-dd-yyyy");

    // this.homeService.getThematicMapLegends().subscribe(legendData =>{
    //   this.legendData = legendData;
    // })   
    this.tabListData(null, this.tabSelect);
  }

  tabListData(areaId, tabSelected) {
    // this.spinner.show();
    this.homeService.getDashboardLeftPanelOptions(areaId).subscribe(lists => {
      // this.thematicDropDownList = tabData['QuickStart'];
      // this.tabKeys = Object.keys(this.thematicDropDownList);
      this.dashboardLeftPanelData = lists;
      this.selectedTab = lists[tabSelected];
      if (!this.selectedOption) {
        this.selectedOption = this.selectedTab.options[2]
        this.selectTabOption(this.selectedOption)
      }

      // for (let i = 0; i < this.tabKeys.length; i++) {
      //   if((areaId=='IND021' && this.tabKeys[i] == "coverage") && tabKey==""){
      //     this.mapNameData = 1;    
      //     //this.indicatorName = this.tabKeys[i];
      //     this.setIndicatorName(this.tabKeys[i]);
      //     this.selectedTab = this.thematicDropDownList[this.tabKeys[i]];
      //     break;     
      //   }else{
      //     this.mapNameData = tabKey;
      //     //this.indicatorName = this.tabKeys[tabKey-1];
      //     this.setIndicatorName(this.tabKeys[tabKey-1]);
      //     this.indicatorValue = this.thematicDropDownList[this.tabKeys[tabKey-1]];
      //   }        
      // }
      // if(areaId=='IND021')
      // this.mapLoad(areaId,'odisha_map.json'); 
      // else
      // this.mapLoad(this.areaId,this.primary_url); 
    })
  }
  mapLoad(areaId, primary_url) {
    this.homeService.getThematicMapData(this.selectedTab.formId, this.selectedOption.path, this.selectedOption.typeDetailId).subscribe(data => {
      this.thematicData = data;
      this.thematicKeys = Object.keys(this.thematicData);
      this.mapData = this.thematicData;
      this.lineChartVisible = false;
      // this.areaLevelId = this.mapData[Object.keys(this.mapData)[0]].areaLevelId;

      setTimeout(() => {
        this.drawMap(primary_url);
      }, 200);
    })
  }

  selectTabs(selectedOption) {
    this.isBackBtnClicked = false;
    this.selectedTab = selectedOption;
    if(this.selectedTab.formId ==1 ){
      this.tabSelect = 0;
      this.blockLevelView = false;
      this.selectTabOption(this.selectedTab.options[0])
    }else{
      this.tabSelect =1;
      this.blockLevelView = false;
      this.selectTabOption(this.selectedTab.options[0])
    }
    this.tabListData(null, this.tabSelect);
    // if(this.areaId!=='IND021' && this.isBackBtnClicked==false){
    //   // this.spinner.show();
    //   this.mapLoad(this.areaId,this.primary_url);
    // }else{
    //   // this.spinner.show();
    //   this.mapLoad(this.areaId,'odisha_map.json');
    // }
  }

  drawMap(url) {
    d3.select('#map svg').remove();
    this.ngContentId = '_ngcontent-' + this.hostRef.nativeElement.attributes[0].name.substr(8);
    // this.width = 800;
    this.width = $("#map-view").width();
    this.height = 430;
    this.projection = d3.geoMercator().scale(1);
    this.path = d3.geoPath()
      .projection(this.projection)
      .pointRadius(2);
    this.svg = d3.select("#map").append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
    this.g = this.svg.append("g");

    d3.json("assets/geomaps/" + url, (error, data) => {
      let boundary = this.centerZoom(data);
      let subunits = this.drawSubUnits(data);
      this.colorSubunits(subunits);
    });
  }

  centerZoom(data) {
    let o = topojson.mesh(data, data.objects.layer1, (a, b) => {
      return a === b;
    });

    this.projection
      .scale(1)
      .translate([0, 0]);

    let b = this.path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height),
      t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2];

    let p = this.projection
      .scale(s)
      .translate(t);
    return o;
  }

  drawSubUnits(data) {
    let subunits = this.g.selectAll(".subunit")
      .data(topojson.feature(data, data.objects.layer1).features)
      .enter().append("path")
      .attr("class", "subunit")
      .attr("d", this.path)
      .style("stroke", "#fff")
      .style("stroke-width", "1px").attr(this.ngContentId, "");
    this.nameSubUnits(data)
    return subunits;
  }

  nameSubUnits(data) {
    this.g
      .selectAll("unit-text")
      .data(topojson.feature(data, data.objects.layer1).features)
      .enter()
      .append("svg:text")
      .text((d) => {
        let selectedArea = this.mapData[d.properties.ID_];
        if (selectedArea) {
          return selectedArea.value
        } else {
          return d.properties.NAME1_
        }
       }
      )
      .attr("x", (d) => {
        return this.path
          .centroid(d)[0];
      })
      .attr("y", (d) => {
        return this.path
          .centroid(d)[1];
      })
      .attr("text-anchor", "middle")
      .attr('font-size', '9px')
      .attr('fill', '#444')

      this.g
      .selectAll("unit-text")
      .data(topojson.feature(data, data.objects.layer1).features)
      .enter()
      .append("svg:text")
      .text((d) => {
        let selectedArea = this.mapData[d.properties.ID_];
        if (selectedArea) {
          return selectedArea.areaName;        
        }
       }
      )
      .attr("x", (d) => {
        return this.path
          .centroid(d)[0];
      })
      .attr("y", (d) => {
        return this.path
          .centroid(d)[1] +10;
      })
      .attr("text-anchor", "middle")
      .attr('font-size', '9px')
      .attr('fill', '#444')
  }

  colorSubunits(subunits) {
    subunits
      .attr("class", (d, i) => {
        let selectedArea = this.mapData[d.properties.ID_];
         if(selectedArea && selectedArea.value > 0)
         return "pathColor";
         else
         return "noDataColor";
      })
      .style("opacity", ".7")
      .style('cursor', "pointer")
      .on("mouseout", (d) => this.onmouseout())
      .on("mousemove", (d) => this.onmousemove(d))
      .on("mousedown", (d) => this.clickHandler(d))
      .on("mouseover", (d) => this.onover(d));
  }

  onover(d) {
    var areaName, datavalue;
    let selectedArea = this.mapData[d.properties.ID_];

    areaName = d.properties.NAME1_;
    if (selectedArea) {
      datavalue = selectedArea.value;

    } else {
      datavalue = "0";
    }

    d3.select(".map_popover_content").html(
      "<span class='semibold'>" + areaName + "</span> "
      + "<br><span class='semibold'>Volunteers :</span> <span>" + datavalue + "</span>");
    d3.select(".map_popover").style("display", "block");
  }

  onmousemove(d) {
    d3.select(".map_popover")
      .style("display", "block")
      .style("left", (d3.event.pageX) - 400 + "px")
      .style("top", (d3.event.pageY - document.getElementById("dashboard").offsetTop - 250) + "px")
      .style("opacity", "1");
  }

  onmouseout() {
    d3.select(".map_popover").style("display", "none");
  }

  clickHandler(d) {
    this.clicks++;
    setTimeout(() => {
      if (this.clicks === 1) {
        this.clicked(d);          // perform single-click action
        this.clicks = 0;          // after action performed, reset counter
      } else {
        this.clicked(d);
        // this.drilldown(d);         // perform double-click action
        this.clicks = 0;          // after action performed, reset counter
      }
    }, 1000)
  }

  // clicked(d){
  //   let selectedArea = this.mapData[d.properties.ID_];
  //   this.areaName=selectedArea.areaName;   
  //   var areaClickId = d.properties.ID_;
  //   this.dashboardService.selectedIndicator = this.indicatorName;
  //   // this.spinner.show();
  //   this.dashboardService.getChartDetails(areaClickId, this.mapNameData).subscribe(data=>{
  //     this.spinner.hide();
  //     this.lineChartData = data; 
  //     if(data!=null || data!=undefined){
  //       this.lineChartVisible=true;
  //     }
  //   })      
  // }

  clicked(d) {
    let selectedDistrict = this.mapData[d.properties.ID_]
    if (selectedDistrict) {
      d3.select(".map_popover").style("display", "none");
      this.blockLevelView = true
      this.selectedDistrict = selectedDistrict
      this.tabListData(this.selectedDistrict.areaId, this.tabSelect);
      this.getBlockLevelData(this.selectedDistrict.areaId);
    }
  }

  getBlockLevelData(districtId) {
    let selectedPath: any;
    if(this.selectedTab.formId == 1){
      selectedPath = this.selectedOption.path;
    }else if(this.selectedTab.formId == 2){
      selectedPath = this.selectedOption.aggregatePath;
    }
    this.homeService.getBlockLevelData(this.selectedTab.formId, selectedPath, districtId).subscribe(res => {
      this.blockLevelData = res;
      // console.log(this.blockLevelData)
    })
  }
  backToStateView() {
    this.blockLevelView = false;
    this.blockLevelData = undefined;
    this.selectTabOption(this.selectedOption)
    this.tabListData(null, this.tabSelect);
  }

  backToMap() {
    this.isBackBtnClicked = true;
    this.areaId = 'IND021';
    this.sideAreaName = 'Odisha';
  }

  selectTabOption(opt) {
    this.selectedOption = opt;
    if (!this.blockLevelView)
      this.mapLoad('IND021', 'odisha_map.json');
    else
      this.getBlockLevelData(this.selectedDistrict.areaId)
  }
}
