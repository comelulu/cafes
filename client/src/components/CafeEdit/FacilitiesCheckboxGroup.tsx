// components/CafeEdit/FacilitiesCheckboxGroup.tsx
interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
    photoSpot: boolean;
    cozySeats: boolean;
    suitableForDate: boolean;
}

interface FacilitiesCheckboxGroupProps {
    facilities: Facilities;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FacilitiesCheckboxGroup({ facilities, handleChange }: FacilitiesCheckboxGroupProps): JSX.Element {
    return (
        <>
            <h2 className="text-lg font-semibold text-darkBrown">Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {Object.keys(facilities).map((facility) => (
                    <label key={facility}>
                        <input
                            type="checkbox"
                            name={facility}
                            checked={facilities[facility as keyof Facilities]}
                            onChange={handleChange}
                        />
                        <span className="ml-2 capitalize">{facility}</span>
                    </label>
                ))}
            </div>

        </>
    );
}

export default FacilitiesCheckboxGroup;
