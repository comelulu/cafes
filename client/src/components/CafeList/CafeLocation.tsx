// components/CafeDetail/CafeLocation.tsx
import Map from "../common/Map";

interface CafeLocationProps {
    address: string;
}

function CafeLocation({ address }: CafeLocationProps): JSX.Element {
    return (
        <div className="md:justify-start mt-4 md:mt-0">
            <div className="w-full h-full flex flex-col justify-evenly gap-5">
                <h3 className="text-2xl font-semibold">Location</h3>
                <Map cafeAddress={address} />
            </div>
        </div>
    );
}

export default CafeLocation;
