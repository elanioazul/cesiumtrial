import { Component, OnInit } from '@angular/core';

//cesium
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
//ol-cesium
import OLCesium from 'ol-cesium';
//ol-cesium mvt

//ol-cesium imageWMS

//OL
import {defaults as olControlDefaults} from 'ol/control.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
//OL vector tiles
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
//OL WMS image but tiled
import olSourceImageWMS from 'ol/source/ImageWMS.js';
import olLayerImage from 'ol/layer/Image.js';
//OL proj
import {getTransform} from 'ol/proj';

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
      maxZoom: 28,
      minZoom: 0,
      format: new MVT({
        idProperty: 'iso_a3',
      }),
      url: 'http://localhost:8080/geoserver/gwc/service/tms/1.0.0/' +
      'cesium:ne_10m_roads' +
      '@EPSG%3A' + '900913' + '@pbf/{z}/{x}/{-y}.pbf'
    })
  })

  public imageWMSSource = new olSourceImageWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'cesium:ne_10m_roads'},
    ratio: 1
  });
  public imageWMSLayer = new olLayerImage({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: this.imageWMSSource
  })



  constructor() {}

  ngOnInit(): void {
    this.map = new Map({
      target: "map",
      projection: 'EPSG:3857',
      layers: [
        this.tileWorldImagery, this.imageWMSLayer
      ],
      view: new View({
        center: [-696799.949848, 5091623.328132],
        zoom: 4,
        minZoom: 2,
      }),
      controls: olControlDefaults({
        attributionOptions: {
          collapsible: false
        }
      })
    });
    const ol3d = new OLCesium({
      map: this.map,
      time() {
        return Cesium.JulianDate.now();
      }
    }); 
    const scene = ol3d.getCesiumScene();
    scene.terrainProvider = Cesium.createWorldTerrain();
    ol3d.setEnabled(true);
  }

}
