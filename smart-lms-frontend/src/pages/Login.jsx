import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await axios.post("/api/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/"); // Chuyển về dashboard sau khi login
        } catch (err) {
            setErr(err.response?.data?.message || "Lỗi server");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600">
            <form className="bg-white shadow-lg rounded p-8 w-full max-w-md" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold mb-4 text-indigo-700">Đăng nhập Smart LMS</h1>
                {err && <div className="mb-4 text-red-600">{err}</div>}
                <input
                    type="email"
                    className="w-full p-3 border rounded mb-4"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="w-full p-3 border rounded mb-6"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-bold">Đăng nhập</button>
            </form>
        </div>
    );
}
