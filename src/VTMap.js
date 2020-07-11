import React from "react";
import { Map, TileLayer, Polygon, Marker } from "react-leaflet";
import borderData from "./border.js";
import "./VTMap.css";
import L from "leaflet";
import leafletPip from "leaflet-pip";
import Modal from "./modal.js";

//creates a random point in "Vermont"
function randomVtPoint() {
  let latitude = Math.random() * (45.005419 - 42.730315 + 1) + 42.730315;
  let longitude =
    (Math.random() * (71.510225 - 73.352182 + 1) + 73.352182) * -1;
  return [latitude, longitude];
}

//checks random point against Vermont polygon - leafletPip
function startingPoint(latLon) {
  let gjLayer = L.geoJson(borderData);
  let results = leafletPip.pointInLayer([latLon[1], latLon[0]], gjLayer);

  console.log(results);
  let coordinates = latLon;

  while (results.length === 0) {
    coordinates = randomVtPoint();
    results = leafletPip.pointInLayer(
      [coordinates[1], coordinates[0]],
      gjLayer
    );
    console.log("in while loop");
    console.log(results);
  }
  return { latitude: coordinates[0], longitude: coordinates[1] };
}
//creates parent element
class VTMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startingCoords: {
        latitude: 44.2601,
        longitude: -72.5754,
      },
      scoreCheckCoords: {
        latitude: 44.2601,
        longitude: -72.5754,
      }, //startingCoords and playStart are meant to be used as a comparison against one another
      zoom: 8,
      //map start state
      vtBorder: L.geoJSON(borderData),
      gamePlay: false,
      playerScore: 100,
      modalDisplayed: false,
      zoomIn: 8,
      //add county state
    };
  }

  //function to start game
  startGame = (evt) => {
    evt.preventDefault();

    let randomPoint = randomVtPoint();
    let randomCoord = startingPoint(randomPoint);
    console.log(randomPoint);
    this.setState(() => {
      return {
        gameStarted: true,
        startingCoords: randomCoord,
        scoreCheckCoords: randomCoord,
        zoomIn: 16,
      };
    });
  };

  countyGuess = (lat, lon) => {
    //let latLon = []

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=geojson`
    )
      .then((res) => res.json())
      .then((geoJSON) => {
        console.log(geoJSON);
      });
  };

  //movement buttons
  north = () => {
    this.setState({
      playerScore: this.state.playerScore - 10,
      startingCoords: {
        latitude: this.state.startingCoords.latitude + 0.002,
        longitude: this.state.startingCoords.longitude,
      },
    });
  };
  south = () => {
    this.setState({
      playerScore: this.state.playerScore - 10,
      startingCoords: {
        latitude: this.state.startingCoords.latitude - 0.002,
        longitude: this.state.startingCoords.longitude,
      },
    });
  };
  east = () => {
    this.setState({
      playerScore: this.state.playerScore - 10,
      startingCoords: {
        latitude: this.state.startingCoords.latitude,
        longitude: this.state.startingCoords.longitude + 0.003,
      },
    });
  };
  west = () => {
    this.setState({
      playerScore: this.state.playerScore - 10,
      startingCoords: {
        latitude: this.state.startingCoords.latitude,
        longitude: this.state.startingCoords.longitude - 0.003,
      },
    });
  };

  giveUp = () => {
    this.setState({ gamePlay:false})
  }

  //guess displays the modal for the county guess
  guess = () => {
    this.setState({ modalDisplayed: true });
  };

  //resets board and starts at mid point of map
  returnPosition = () => {
    this.setState({
      gameStarted: false
    })
    setTimeout(() => { window.location.reload(); }, 150)
  }

  openModal = () => {
    this.setState({
      modalDisplayed: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalDisplayed: false,
    });
  };

  zoomOut = () => {
    this.setState({
      zoomIn: this.state.zoomIn -1,
    })
  }



  render() {
    let vtBorder = borderData.geometry.coordinates[0].map((coordSet) => {
      return [coordSet[1], coordSet[0]];
    });

    console.log(this.state.startingCoords);
    this.countyGuess(
      this.state.startingCoords.latitude,
      this.state.startingCoords.longitude
    );

    return (
      <div className="game-container">
        {this.state.modalDisplayed ? (
          <Modal openModal={this.openModal} />
        ) : null}
        <h1>Geo-Vermonter</h1>
        <Map
          center={[this.state.startingCoords.latitude, this.state.startingCoords.longitude]}
          zoom={this.state.zoomIn}
          style={{ height: "600px", width: "600px" }}
          dragging={false}
          boxZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
          scrollWheelZoom={false}

        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />

          <Polygon positions={vtBorder} />
          <Marker
            position={[
              this.state.startingCoords.latitude,
              this.state.startingCoords.longitude,
            ]}
          />
        </Map>
        <div className="game">
          <button
            id="start-game"
            onClick={this.startGame}
            disabled={this.state.gameStarted}
          >
            Start Game
          </button>
          <button
            id="guess-spot"
            disabled={!this.state.gameStarted}
            onClick={this.guess}
          >
            Guess Spot
          </button>
          <button
            id="give-up"
            disabled={!this.state.gameStarted}
            onClick={this.giveUp}
          >
            Give Up
          </button>
          <button id='resetBoard' onClick={this.returnPosition}>
            Reset
          </button>
        </div>
        <div className="controls">
          <button onClick={this.north}>North</button>
          <button onClick={this.south}>South</button>
          <button onClick={this.west}>West</button>
          <button onClick={this.east}>East</button>
          <button id="zoom-out">Zoom Out</button>
        </div>
        <div id='infoPanel'>
          <p>Latitude: {this.state.scoreCheckCoords.latitude}</p>
          <p>Longitude: {this.state.scoreCheckCoords.longitude}</p>
          <p>County:</p>
          <p>Score: {this.state.playerScore}</p>
        </div>
      </div>
    );
  }
}

export default VTMap;