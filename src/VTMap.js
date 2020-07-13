import React from "react";
import { Map, TileLayer, Polygon, Marker, Polyline } from "react-leaflet";
import borderData from "./border.js";
import "./VTMap.css";
import L from "leaflet";
import leafletPip from "leaflet-pip";
import Modal from "./modal.js";
import HsModal from "./hsModal.js";

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
      gameStarted: false,
      playerScore: 100,
      modalDisplayed: false,
      highDcoreDisplay: false,
      zoomIn: 7.45,
      county: undefined,
      status: undefined,
      highscoreDisplay: false,
      allPositions: []
    };
  }

  //function to start game
  startGame = (evt) => {
    evt.preventDefault();

    let randomPoint = randomVtPoint();
    let randomCoord = startingPoint(randomPoint);
    this.getCounty(randomCoord.latitude, randomCoord.longitude);
    console.log(randomPoint);
    this.setState(() => {
      return {
        gameStarted: true,
        startingCoords: randomCoord,
        scoreCheckCoords: randomCoord,
        zoomIn: 16,
        guess: false,
        allPositions: [[randomCoord.latitude, randomCoord.longitude]] 
      };
    });
  };

  //setting county - fetchs data
  getCounty = (lat, lon) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    )
      .then((res) => res.json())
      .then((obj) => {
        console.log(obj.address.county);
        this.setState({
          countyInfo: obj.address.county,
          county: obj.address.county.split(" ").join("-").toLowerCase(),
        });
      });
  };

  //checks if guess is correct or wrong
  countyGuess = (evt) => {
    console.log(evt.target.getAttribute("id"));
    console.log(this.state.county);
    if (this.state.county === evt.target.getAttribute("id")) {
      console.log("Correct");
      this.setState({
        status: "correct",
        modalDisplayed: false,
        gameStarted: false
      });
    } else {
      this.setState({
        playerScore: this.state.playerScore - 20,
        status: "wrong",
      });
      console.log("Wrong");
    }
  };

  //movement buttons
  north = () => {
    this.setState((preState) => {
      return {
        playerScore: preState.playerScore - 10,
        startingCoords: {
          latitude: preState.startingCoords.latitude + 0.002,
          longitude: preState.startingCoords.longitude,
        },
        allPositions: preState.allPositions.concat([[preState.startingCoords.latitude + .002, preState.startingCoords.longitude]])
      }
    });
  };

  south = () => {
    this.setState((preState) => {
      return {
        playerScore: this.state.playerScore - 10,
        startingCoords: {
          latitude: this.state.startingCoords.latitude - 0.002,
          longitude: this.state.startingCoords.longitude,
        },
        allPositions: preState.allPositions.concat([[preState.startingCoords.latitude - 0.002, preState.startingCoords.longitude]])
      }

    });
  };
  east = () => {
    this.setState((preState) => {
      return {
        playerScore: this.state.playerScore - 10,
        startingCoords: {
          latitude: this.state.startingCoords.latitude,
          longitude: this.state.startingCoords.longitude + 0.003,
        },
        allPositions: preState.allPositions.concat([[preState.startingCoords.latitude, preState.startingCoords.longitude + 0.003]])
      }
    });
  };

  west = () => {
    this.setState((preState) => {
      return {
        playerScore: this.state.playerScore - 10,
        startingCoords: {
          latitude: this.state.startingCoords.latitude,
          longitude: this.state.startingCoords.longitude - 0.003,
        },
        allPositions: preState.allPositions.concat([[preState.startingCoords.latitude, preState.startingCoords.longitude - 0.003]])
      }
    });
  };

  //starting coords are not working
  returnOriginalPosition = () => {
    this.setState({
      playerScore: this.state.playerScore,
      startingCoords: {
        latitude: this.state.scoreCheckCoords.latitude,
        longitude: this.state.scoreCheckCoords.longitude,
      },
    });
  };

  giveUp = () => {
    this.setState({
      gameStarted: false,
      playerScore: this.state.playerScore - 20,
    });
  };

  //guess displays the modal for the county guess
  guess = () => {
    this.setState({ modalDisplayed: true });
  };

  gameOver = () => {
    if (this.state.playerScore === 0 && this.state.gameStarted === true) {
        this.setState({

        })
    }
  }

  //resets board and starts at mid point of map
  returnPosition = () => {
    this.setState({
      gameStarted: false,
    });
    alert(
      "You have reset. I award you no points, and may God have mercy on your soul."
    );
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

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
      zoomIn: this.state.zoomIn - 1,
      playerScore: this.state.playerScore - 10,
    });
  };

  hsOpenModal = () => {
    this.setState({ highscoreDisplay: true })
  }

  hsCloseModal = () => {
    this.setState({ highscoreDisplay: false })
  }

  render() {
    let vtBorder = borderData.geometry.coordinates[0].map((coordSet) => {
      return [coordSet[1], coordSet[0]];
    });

    console.log(this.state.startingCoords);
    console.log(this.state.allPositions)

    return (
      <div className="game-container">
        {this.state.modalDisplayed ? (
          <Modal
            closeModal={this.closeModal}
            countyGuess={this.countyGuess}
            status={this.state.status}
          />
        ) : null}
        {this.state.highscoreDisplay ? (
          <HsModal
            hsCloseModal={this.hsCloseModal}
            status={this.state.status}
          />
        ) : null}

        <h1>Geo-Vermonter</h1>
        <div className="mapInfo">
          <Map
            id="map"
            center={[
              this.state.startingCoords.latitude,
              this.state.startingCoords.longitude,
            ]}
            zoom={this.state.zoomIn}
            style={{ height: "600px", width: "600px" }}
            dragging={false}
            boxZoom={false}
            doubleClickZoom={false}
            zoomControl={false}
            scrollWheelZoom={false}
            touchZoom={false}
            stroke={true}
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

            {this.state.allPositions.length > 1 ? (
              <Polyline
                positions={
                  this.state.allPositions
                }
              />) : undefined
            }

          </Map>
          <div className="infoPanel">
            <p>Latitude: {this.state.scoreCheckCoords.latitude}</p>
            <p>Longitude: {this.state.scoreCheckCoords.longitude}</p>
            <p>County: {this.state.status === "correct" ? this.state.countyInfo : ""}</p>
            <p>Score: {this.state.playerScore}</p>
            <h3>{this.state.status}</h3>
          </div>
        </div>
        <div className="game-buttons">
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
          <button id="resetBoard" onClick={this.returnPosition}>
            Reset
          </button>
        </div>
        <div className="controls">
          <button id="movementButtons" onClick={this.north}>
            North
          </button>
          <button id="movementButtons" onClick={this.south}>
            South
          </button>
          <button id="movementButtons" onClick={this.west}>
            West
          </button>
          <button id="movementButtons" onClick={this.east}>
            East
          </button>
          <button id="movementButtons" onClick={this.zoomOut}>
            Zoom Out
          </button>
          <button id="movementButtons" onClick={this.returnOriginalPosition}>
            Return
          </button>
        </div>

        <div id="highScore-box">
          <button onClick={this.hsOpenModal}>Highscores</button>
        </div>
      </div>
    );
  }
}

export default VTMap;
