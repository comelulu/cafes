// components/CafeDetail/CafeFacilities.tsx
import { FaWifi, FaParking, FaRestroom, FaDog, FaCamera, FaCouch, FaHeart } from "react-icons/fa";

interface Facility {
    key: string;
    label: string;
    icon: React.ElementType;
}

interface CafeFacilitiesProps {
    facilities: { [key: string]: boolean };
}

const facilitiesData: Facility[] = [
    { key: "wifi", label: "WiFi", icon: FaWifi },
    { key: "parking", label: "Parking", icon: FaParking },
    { key: "bathroom", label: "Bathroom", icon: FaRestroom },
    { key: "petFriendly", label: "Pet-friendly", icon: FaDog },
    { key: "photoSpot", label: "Photo Spot", icon: FaCamera },
    { key: "cozySeats", label: "Cozy Seats", icon: FaCouch },
    { key: "suitableForDate", label: "Suitable for Date", icon: FaHeart },
];

function CafeFacilities({ facilities }: CafeFacilitiesProps): JSX.Element {
    return (
        <div className="border-b-2 border-gray-100 pb-5">
            <h3 className="text-xl font-semibold mb-4">Facilities</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 p-5">
                {facilitiesData.map(
                    ({ key, label, icon: Icon }) =>
                        facilities[key] && (
                            <li key={key} className="flex flex-col items-center gap-2 text-primary">
                                <Icon size={24} />
                                <span>{label}</span>
                            </li>
                        )
                )}
            </ul>
        </div>
    );
}

export default CafeFacilities;
