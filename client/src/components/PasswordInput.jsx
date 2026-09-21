import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = ({
    id,
    name,
    value,
    onChange,
    placeholder,
    autoComplete,
    required = false,
    disabled = false
}) => {
    const [showPassowrd, setShowPassowrd] = useState(false)

    return (
        <div className="relative">
            <input 
                type={showPassowrd ? "text" : "password"}
                id={id} 
                value={value}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                required={required}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button 
                type="button"
                onClick={ () => setShowPassowrd((prev) => !prev)}
                disabled={disabled}
                aria-label={showPassowrd ? "Hide password" : "Show password"}
                aria-pressed={showPassowrd}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {
                    showPassowrd ? (
                        <FiEyeOff size={19}/>
                    ) : (
                        <FiEye size={19}/>
                    )
                }
            </button>
        </div>
    )
}

export default PasswordInput