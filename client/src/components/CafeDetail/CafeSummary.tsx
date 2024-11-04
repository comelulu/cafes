// components/CafeDetail/CafeSummary.tsx
interface CafeSummaryProps {
    summaries: { [key: string]: string | boolean };
    summaryLabels: { [key: string]: string };
}

function CafeSummary({ summaries, summaryLabels }: CafeSummaryProps): JSX.Element {
    console.log("summaries: ", summaries);

    return (
        <div className="border-b-2 border-gray-100 pb-5">
            <h3 className="text-xl font-bold mb-4 text-darkBrown">Summary</h3>
            <div className="flex flex-wrap gap-3">
                {Object.entries(summaries)
                    .filter(([_, value]) => value === true || value === "true")
                    .map(([key]) => (
                        <span key={key} className="bg-primary text-white px-3 py-1 rounded-[10px] font-semibold text-sm">
                            {summaryLabels[key] || key}
                        </span>
                    ))}
            </div>
        </div>
    );
}


export default CafeSummary;
