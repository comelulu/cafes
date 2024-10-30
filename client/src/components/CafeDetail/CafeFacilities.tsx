// components/CafeDetail/CafeFacilities.tsx
import {
    FaWifi,
    FaParking,
    FaRestroom,
    FaDog,
    FaShoppingBag,
    FaTruck,
    FaUsers,
    FaApple
} from "react-icons/fa";

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
    { key: "petFriendly", label: "Pet-friendly", icon: FaDog },
    { key: "bathroom", label: "Bathroom", icon: FaRestroom },
    { key: "toGo", label: "To Go", icon: FaShoppingBag },
    { key: "delivery", label: "Delivery", icon: FaTruck },
    { key: "groupsAvailable", label: "Groups", icon: FaUsers },
    { key: "applePay", label: "Apple Pay", icon: FaApple },
];

function CafeFacilities({ facilities }: CafeFacilitiesProps): JSX.Element {
    return (
        <div className="border-b-2 border-gray-100 pb-5">
            <h3 className="text-xl font-bold mb-4 text-darkBrown">Facilities</h3>
            <ul className="grid grid-cols-4 gap-6 p-5">
                {facilitiesData.map(({ key, label, icon: Icon }) => (
                    <li
                        key={key}
                        className={`flex flex-col items-center gap-2 ${facilities[key] ? 'text-primary' : 'text-gray-400'
                            }`}
                    >
                        <Icon size={24} />
                        <span className="text-gray-800">{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CafeFacilities;
