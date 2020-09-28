import { Component, OnInit } from '@angular/core';

//cesium
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
//ol-cesium
import OLCesium from 'ol-cesium';
//OL
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as olProj from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  
  public tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });
  public map;


  constructor() {}

  ngOnInit(): void {
    //const viewer = new Cesium.Viewer('cesiumContainer', {
    //  terrainProvider: Cesium.createWorldTerrain()
    //});
    //const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    //viewer.camera.flyTo({
    //  destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    //  orientation : {
    //    heading : Cesium.Math.toRadians(0.0),
    //    pitch : Cesium.Math.toRadians(-15.0),
    //  }
    //});
    this.map = new Map({
      target: "map",
      projection: 'EPSG:3857',
      layers: [
        this.tileWorldImagery
      ],
      view: new View({
        center: olProj.fromLonLat([134.364805, -26.710497]),
        zoom: 4,
        minZoom: 2,
      }),
    });
    const ol3d = new OLCesium({map: this.map}); // map is the ol.Map instance
    ol3d.setEnabled(true);
    //window.ol3d = ol3d; // temporary hack for easy console debugging
  }

}
