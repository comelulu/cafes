// components/CafeDetail/CafeDescription.tsx
interface CafeDescriptionProps {
    description: string;
}

function CafeDescription({ description }: CafeDescriptionProps): JSX.Element {
    return (
        <div className="text-lg font-light mt-1 border-b-2 border-gray-100 pb-5 flex flex-col gap-3">
            <h3 className="text-darkBrown text-xl font-bold mb-2">Description</h3>
            <p className="text-gray-800">{description}</p>
            <p className="text-base mt-3 text-gray-800 text-right italic font-light">
                Introduced by <span className="text-primary">Coding Valley</span>
            </p>
        </div>
    );
}

export default CafeDescription;
