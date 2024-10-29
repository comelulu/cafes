// components/CafeEdit/CafeForm.tsx
import React from "react";
import KakaoMap from "../Common/KakaoMap";
import FacilitiesCheckboxGroup from "./FacilitiesCheckboxGroup";

interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
    photoSpot: boolean;
    cozySeats: boolean;
    suitableForDate: boolean;
}

interface FormData {
    name: string;
    address: string;
    description: string;
    facilities: Facilities;
}

interface CafeFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onSubmit: (updatedData: FormData) => void;
}

function CafeForm({ formData, setFormData, onSubmit }: CafeFormProps): JSX.Element {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prevData) => ({
                ...prevData,
                facilities: {
                    ...prevData.facilities,
                    [name]: checked,
                },
            }));
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
                className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74]"
                required
            />

            <KakaoMap formData={formData} setFormData={setFormData as any} />

            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74] h-48 resize-none"
                required
            />

            <FacilitiesCheckboxGroup facilities={formData.facilities} handleChange={handleChange} />

            <button
                type="submit"
                className="w-full py-4 bg-[#002D74] text-white rounded-lg font-semibold hover:bg-[#003366] transition duration-300"
            >
                Update Cafe
            </button>
        </form>
    );
}

export default CafeForm;
