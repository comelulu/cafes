// components/CafeEdit/CafeForm.tsx
import React from "react";
import KakaoMap from "../common/KakaoMap";
import FacilitiesCheckboxGroup from "./FacilitiesCheckboxGroup";

interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
    photoSpot: boolean;
    cozySeats: boolean;
    suitableForDate: boolean;
    toGo: boolean;
    delivery: boolean;
    groupAvailable: boolean;
    applePay: boolean;
}

interface Summaries {
    suburban: boolean;
    large: boolean;
    dessert: boolean;
    rooftop: boolean;
    bookCafe: boolean;
    scenicView: boolean;
    culturalComplex: boolean;
    architectureTheme: boolean;
}

interface FormData {
    name: string;
    address: string;
    description: string;
    facilities: Facilities;
    summaries: Summaries;
}

interface CafeFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onSubmit: (updatedData: FormData) => void;
    summaryLabels: { [key in keyof Summaries]: string };
}

function CafeForm({ formData, setFormData, onSubmit, summaryLabels }: CafeFormProps): JSX.Element {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prevData) => {
                if (name in prevData.facilities) {
                    return {
                        ...prevData,
                        facilities: {
                            ...prevData.facilities,
                            [name]: checked,
                        },
                    };
                } else if (name in prevData.summaries) {
                    return {
                        ...prevData,
                        summaries: {
                            ...prevData.summaries,
                            [name]: checked,
                        },
                    };
                }
                return prevData;
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
                type="text"
                name="name"
                placeholder="Cafe Name"
                value={formData.name}
                onChange={handleChange}
                className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBrown"
                required
            />

            <KakaoMap formData={formData} setFormData={setFormData as any} />

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBrown h-48 resize-none"
                maxLength={100}
                required
            />

            <h2 className="text-lg font-semibold text-darkBrown">Summary</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {Object.keys(formData.summaries).map((key) => (
                    <label key={key} className="flex items-center">
                        <input
                            type="checkbox"
                            name={key}
                            checked={formData.summaries[key as keyof Summaries]}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        {summaryLabels[key as keyof Summaries]}
                    </label>
                ))}
            </div>

            <FacilitiesCheckboxGroup facilities={formData.facilities} handleChange={handleChange} />

            <button
                type="submit"
                className="w-full py-4 bg-secondary text-primary rounded-lg font-semibold hover:bg-[#E7CBA6] transition duration-300"
            >
                Update Cafe
            </button>
        </form>
    );
}

export default CafeForm;
