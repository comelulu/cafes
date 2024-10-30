import { useState, useEffect } from "react";

interface FormData {
    address: string;
}

interface KakaoMapProps {
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    formData: FormData;
}

declare global {
    interface Window {
        kakao: any;
        daum: any;
    }
}

const KakaoMap = ({ setFormData, formData }: KakaoMapProps): JSX.Element => {
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);

    useEffect(() => {
        window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };

            setMap(new window.kakao.maps.Map(container, options));
            setMarker(new window.kakao.maps.Marker());
        });
    }, []);

    const onClickAddr = () => {
        new window.daum.Postcode({
            oncomplete: function (addrData: any) {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(
                    addrData.address,
                    function (result: any, status: any) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const currentPos = new window.kakao.maps.LatLng(
                                result[0].y,
                                result[0].x
                            );
                            const addrInput = document.getElementById("addr") as HTMLInputElement;
                            addrInput.value = addrData.address;
                            map.panTo(currentPos);
                            marker.setMap(null);
                            marker.setPosition(currentPos);
                            marker.setMap(map);

                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                address: addrData.address,
                            }));
                        }
                    }
                );
            },
        }).open();
    };

    return (
        <div className="w-full" style={{ width: "100%" }}>
            <input
                id="addr"
                className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74] w-full"
                readOnly
                onClick={onClickAddr}
                placeholder="주소를 클릭하여 검색하세요"
                value={formData.address || ""}
            />

            <div
                id="map"
                className="w-full mt-2"
                style={{ width: "100%", height: "400px" }}
            ></div>
        </div>
    );
};

export default KakaoMap;
