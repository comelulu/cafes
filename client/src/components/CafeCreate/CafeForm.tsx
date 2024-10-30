// components/CafeCreate/CafeForm.tsx
import React from "react";
import KakaoMap from "../common/KakaoMap";
import CheckboxGroup from "./CheckboxGroup";
import ImageUploader from "./ImageUploader";

interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
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
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    images: File[];
    previews: string[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
    summaryLabels: { [key in keyof Summaries]: string };
}

function CafeForm({
    formData,
    setFormData,
    onSubmit,
    images,
    previews,
    setImages,
    setPreviews,
    summaryLabels,
}: CafeFormProps): JSX.Element {
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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (images.length === 0) {
            e.preventDefault();
            alert("이미지를 최소 한 장 업로드해 주세요.");
            return;
        }
        onSubmit(e); // Continue with submission if there's at least one image
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
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
                required
            />

            <h2 className="text-lg font-semibold">Summary</h2>
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

            <CheckboxGroup title="Facilities" options={formData.facilities as any} handleChange={handleChange} />

            <ImageUploader images={images} previews={previews} setImages={setImages} setPreviews={setPreviews} />

            <button
                type="submit"
                className="w-full py-4 bg-secondary text-primary rounded-lg font-semibold transition duration-300"
            >
                Add Cafe
            </button>
        </form>
    );
}

export default CafeForm;
