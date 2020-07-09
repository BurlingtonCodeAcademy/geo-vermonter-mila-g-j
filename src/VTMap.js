import React from 'react'
import { Map, TileLayer, Polygon, Marker } from 'react-leaflet'
import borderData from './border.js'
import "./VTMap.css"
import L from 'leaflet'
import leafletPip from 'leaflet-pip'

//creates a random point in "Vermont"
function randomVtPoint() {
    let latitude = Math.random() * (45.005419 - 42.730315 + 1) + 42.730315;
    let longitude = Math.random() * ((-71.510225) - (-73.352182) + 1) + (-73.352182);
    return [latitude, longitude]
}

//checks random point against Vermont polygon - leafletPip
function startingPoint(latLon) {
    let gjLayer = L.geoJson(borderData);
    let results = leafletPip.pointInLayer(latLon, gjLayer);
    console.log(results)
    let coordinates = latLon

    while (results.length === 0) {
        coordinates = randomVtPoint()
        results = leafletPip.pointInLayer(coordinates, gjLayer)
    }
    return coordinates
}

//creates parent element
class VTMap extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            gameStarted: false,
            startingCoords:[44.0886, -72.7317]
        }
    }

    

    //function to start game
    startGame = (evt) => {
        evt.preventDefault()

        let randomPoint = randomVtPoint()
        let randomCoord = startingPoint(randomPoint)

        this.setState(() => {
            return {
                gameStarted: true, 
                startingCoords: randomCoord,
            }
        })
    }

    render() {

        let vtBorder = borderData.geometry.coordinates[0].map(coordSet => {
            return [coordSet[1], coordSet[0]]
        })

        console.log(this.state.startingCoords)
        return (
            <div className="game-container">
                <h1>Geo-Vermonter</h1>
                <Map center={[44.0886, -72.7317]} zoom={7.4} style={{ height: '600px', width: '600px' }} dragging={false} boxZoom={false} doubleClickZoom={false} zoomControl={false}>
                    <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' />

                    <Polygon positions={vtBorder} />
                    <Marker position={this.state.startingCoords} />
                </Map>
                <div className="game">
                    <button id="start-game" onClick={this.startGame} disabled={this.state.gameStarted}>Start Game</button>
                    <button id="guess-spot" disabled={!this.state.gameStarted}>Guess Spot</button>
                    <button id="give-up" disabled={!this.state.gameStarted}>Give Up</button>
                </div>
                <div className="controls">
                    <button id="north">North</button>
                    <button id="south">South</button>
                    <button id="west">West</button>
                    <button id="east">East</button>
                    <button id="zoom-out">Zoom Out</button>
                </div>
                <div>
                    <p>Latitude:</p>
                    <p>Longitud:</p>
                    <p>County:</p>
                    <p>Score:</p>
                </div>
            </div>
        )
    }
}

export default VTMap