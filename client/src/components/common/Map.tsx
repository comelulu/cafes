import { useEffect } from "react";

interface MapProps {
    cafeAddress?: string;
}

declare global {
    interface Window {
        kakao: any;
    }
}

export default function Map({ cafeAddress }: MapProps) {
    const address = cafeAddress || "서울 종로구 세종로";

    useEffect(() => {
        const initializeMap = () => {
            const mapContainer = document.getElementById("map");
            const mapOption = {
                center: new window.kakao.maps.LatLng(0, 0),
                level: 3,
            };
            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function (result: any, status: any) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    map.setCenter(coords);

                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: coords,
                    });
                    marker.setMap(map);
                }
            });

            const mapTypeControl = new window.kakao.maps.MapTypeControl();
            map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

            const zoomControl = new window.kakao.maps.ZoomControl();
            map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        };

        if (!window.kakao) {
            const mapScript = document.createElement("script");
            mapScript.src =
                "//dapi.kakao.com/v2/maps/sdk.js?appkey=27ec0e0ded485b41c5d05fb12e6ea73d&libraries=services";
            mapScript.async = true;
            document.head.appendChild(mapScript);

            mapScript.onload = () => {
                window.kakao.maps.load(initializeMap);
            };
        } else {
            window.kakao.maps.load(initializeMap);
        }
    }, [address]);

    return <div id="map" className="w-full h-[430px] rounded-lg" />;
}
