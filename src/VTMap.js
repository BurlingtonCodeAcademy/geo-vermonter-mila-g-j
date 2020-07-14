import React from "react";
import { Map, TileLayer, Polygon, Marker, Polyline } from "react-leaflet";
import borderData from "./border.js";
import "./VTMap.css";
import L from "leaflet";
import leafletPip from "leaflet-pip";
import Modal from "./modal.js";
import HsModal from "./hsModal.js";
import InitialsModal from "./initialsModal.js";

//creates a random point in "Vermont"
function randomVtPoint() {
  let latitude = Math.random() * (45.005419 - 42.730315 + 1) + 42.730315;
  let longitude =
    (Math.random() * (71.510225 - 73.352182 + 1) + 73.352182) * -1;
  return [latitude, longitude];
}

//checks random point against Vermont polygon - leafletPip
function startingPoint(latLon) {
  let omniLayer = L.geoJson(borderData);
  let results = leafletPip.pointInLayer([latLon[1], latLon[0]], omniLayer);

  console.log(results);
  let coordinates = latLon;

  while (results.length === 0) {
    coordinates = randomVtPoint();
    results = leafletPip.pointInLayer(
      [coordinates[1], coordinates[0]],
      omniLayer
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
      returnToNorm: {
        latitude: 44.2601,
        longitude: -72.5754,
      }, //startingCoords and playStart are meant to be used as a comparison against one another
      zoom: 8,
      //map start state
      vtBorder: L.geoJSON(borderData),
      gameStarted: false,
      playerScore: 100,
      modalDisplayed: false,
      highScoreDisplay: false,
      zoomIn: 7.45,
      county: undefined,
      status: undefined,
      highscoreDisplay: false,
      allPositions: [],
      value: '',
      hsArray: [],
      localStorageState: Object.entries(localStorage)

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
        returnToNorm: randomCoord,
        zoomIn: 16,
        guess: false,
        allPositions: [[randomCoord.latitude, randomCoord.longitude]],
        playerScore: 100,
        status: undefined,
        initialsDisplay: false
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
      alert("You Win!")
      console.log("Correct");
      this.setState({
        status: "Correct",
        modalDisplayed: false,
        gameStarted: false,
        initialsDisplay: true,
        hsArray: this.state.playerScore,

      });
    } else {
      this.setState({
        playerScore: this.preState.playerScore - 20,
        status: "Wrong",
      });
      console.log("Wrong");
    }
  };

  //movement buttons
  north = () => {
    this.setState((preState) => {
      return {
        playerScore: preState.playerScore - 5,
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
        playerScore: this.state.playerScore - 5,
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
        playerScore: this.state.playerScore - 5,
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
        playerScore: this.state.playerScore - 5,
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
      zoomIn: 16,
      startingCoords: this.state.returnToNorm,
      playerScore: this.state.playerScore - 5,
    });
  };


  //give up restarts the game, but also takes points away
  giveUp = () => {
    this.setState({
      gameStarted: false,

    });
  };

  //guess displays the modal for the county guess
  guess = () => {
    this.setState({ modalDisplayed: true });
  };

  //sends player score to score array
  scoreKeeper = (hsArray) => {
    hsArray.push()
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

  //opens county list modal
  openModal = () => {
    this.setState({
      modalDisplayed: true,
    });
  };

  //closes county list modal
  closeModal = () => {
    this.setState({
      modalDisplayed: false,
    });
  };

  //zoom out function
  zoomOut = () => {
    this.setState({
      zoomIn: this.state.zoomIn - 1,
      playerScore: this.state.playerScore - 10,
    });
  };

  //opens high score modal
  hsOpenModal = () => {
    this.setState({ highscoreDisplay: true })
  }

  //closes high score modal
  hsCloseModal = () => {
    this.setState({ highscoreDisplay: false })
  }

  //handles change on initials form
  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  //handles change on initials form
  handleStorage = () => {
    this.setState({ localStorageState: Object.entries(localStorage) });
  }

  //handles submit on initials form
  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();

  // }

  //opens initials modal
  initOpenModal = () => {
    this.setState({ initialsDisplay: true })
  }

  //closes initials modal
  initCloseModal = () => {
    this.setState({ initialsDisplay: false })
  }

  componentDidMount() {
    // window.localStorage.clear()
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let initials = JSON.stringify(this.state.value)
    let score = JSON.stringify(this.state.playerScore)
    console.log(Object.entries(localStorage))

    //renders info saved in local storage
    Object.entries(localStorage)
    this.setState({
      value: ""
    })

    window.localStorage.setItem(initials, score)
    this.setState({ localStorageState: Object.entries(localStorage) })
    // after setting local storage state needs to be updated

    console.log(window.localStorage)
    console.log(this.state.value)
    console.log(this.state.playerScore)
  }

  handleGetData = () => {
    console.log(window.localStorage.getItem("test"))
  }

  render() {
    let vtBorder = borderData.geometry.coordinates[0].map((coordSet) => {
      return [coordSet[1], coordSet[0]];
    });

    console.log(this.state.startingCoords);
    console.log(this.state.allPositions)
    console.log(this.state.hsArray)

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
            scoreKeeper={this.scoreKeeper}
            scores={this.state.localStorageState}
          />
        ) : null}
        {this.state.initialsDisplay ? (
          <InitialsModal
            playerScore={this.state.playerScore}
            localStorageState={this.handleStorage}
            value={this.state.value}
            handleChange={this.handleChange}
            submitForm={this.handleSubmit}
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
            <p>Latitude: {this.state.returnToNorm.latitude}</p>
            <p>Longitude: {this.state.returnToNorm.longitude}</p>
            <p>County: {this.state.status === "Correct" ? this.state.countyInfo : ""}</p>
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
