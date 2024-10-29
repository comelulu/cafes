// components/CafeDetail/ErrorMessage.tsx
interface ErrorMessageProps {
    message: string;
}

function ErrorMessage({ message }: ErrorMessageProps): JSX.Element {
    return <div className="pt-24 text-center text-red-500">{message}</div>;
}

export default ErrorMessage;
