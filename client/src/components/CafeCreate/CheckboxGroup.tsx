// components/CafeCreate/CheckboxGroup.tsx
interface CheckboxGroupProps {
    title: string;
    options: { [key: string]: boolean };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function CheckboxGroup({ title, options, handleChange }: CheckboxGroupProps): JSX.Element {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(options).map((option) => (
                    <label key={option} className="flex items-center">
                        <input
                            type="checkbox"
                            name={option}
                            checked={options[option]}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="capitalize">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default CheckboxGroup;
