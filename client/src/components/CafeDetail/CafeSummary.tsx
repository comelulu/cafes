// components/CafeDetail/CafeSummary.tsx
interface CafeSummaryProps {
    summaries: { [key: string]: boolean };
    summaryLabels: { [key: string]: string };
}

function CafeSummary({ summaries, summaryLabels }: CafeSummaryProps): JSX.Element {
    return (
        <div className="border-b-2 border-gray-100 pb-5">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="flex flex-wrap gap-3">
                {Object.entries(summaries)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                        <span key={key} className="bg-primary text-white px-3 py-1 rounded-md font-semibold text-sm">
                            {summaryLabels[key] || key}
                        </span>
                    ))}
            </div>
        </div>
    );
}

export default CafeSummary;
