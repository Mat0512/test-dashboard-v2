import { useState, useEffect } from "react";

import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    DirectionsService,
    DirectionsRenderer,
    useJsApiLoader,
} from "@react-google-maps/api";
import { Box } from "@mui/material";

import LoadingNotif from "../../components/LoadingNotif";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = { lat: 14.57643, lng: 121.19362 }; // antipolo fire station
const lib = ["places"];

const Map = ({ reportData }) => {
    const [directions, setDirections] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: lib,
    });

    useEffect(() => {
        if (isLoaded) {
            const fetchService = async () => {
                const directionsService =
                    new window.google.maps.DirectionsService();

                await directionsService.route(
                    {
                        origin: center,
                        destination: {
                            lat: parseFloat(reportData.lat),
                            lng: parseFloat(reportData.lng),
                        },
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === "OK" && result) {
                            setDirections(result);
                        } else {
                            alert("Can't get direction");
                        }
                    }
                );
            };
            console.log("is loaded");
            fetchService();
        }
    }, [isLoaded]);

    return (
        <>
            <Box
                display="flex"
                my="5px"
                flexDirection="column"
                width="100%"
                gap={2}
            >
                {isLoaded && reportData ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                            lat: parseFloat(reportData.lat),
                            lng: parseFloat(reportData.lng),
                        }}
                        zoom={10}
                    >
                        {/* renders the red line direction */}
                        {directions && (
                            <DirectionsRenderer
                                directions={directions}
                                options={{
                                    polylineOptions: {
                                        strokeColor: "#1976d2",
                                    },
                                }}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <LoadingNotif />
                )}
            </Box>
        </>
    );
};

export default Map;
