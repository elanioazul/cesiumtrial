import { Component, OnInit } from '@angular/core';

//cesium
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
//ol-cesium
import OLCesium from 'ol-cesium';
//OL
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public map;
  
  public tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });

  public roadGeoserverTiled = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      maxZoom: 15,
      format: new MVT({
        idProperty: 'iso_a3',
      }),
      url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/cesium%3Ane_10m_roads@EPSG%3A900913@pbf'
    })
  })

  constructor() {}

  ngOnInit(): void {
    this.map = new Map({
      target: "map",
      projection: 'EPSG:3857',
      layers: [
        this.tileWorldImagery, this.roadGeoserverTiled
      ],
      view: new View({
        center: [-696799.949848, 5091623.328132],
        zoom: 4,
        minZoom: 2,
      }),
    });
    const ol3d = new OLCesium({map: this.map}); 
    ol3d.setEnabled(true);
  }

}
