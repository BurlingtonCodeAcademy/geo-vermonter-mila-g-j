import React from 'react'


function randomVtPoint() {
    let latitude = Math.random() * (45.005419 - 42.730315 + 1) + 42.730315;
    let longitude = Math.random() * ((-71.510225) - (-73.352182) + 1) + (-73.352182);

    return [latitude, longitude]
}


export default VermontPoint

