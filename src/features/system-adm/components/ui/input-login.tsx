interface InputLoginProps {
    label: string,
    type?: string,
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}
export function InputLogin({ label, type = "text", value, onChange }: InputLoginProps) {
    return (
        <div>
            <label htmlFor="">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}