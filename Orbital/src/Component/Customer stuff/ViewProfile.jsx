import CustHeader from "./CustHeader";
import { useEffect, useState } from "react";
import axios from "axios";

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editPhone, setEditPhone] = useState("");
    const [editDietary, setEditDietary] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                let email = localStorage.getItem("email");
                if (!email) {
                    setError("No email found in local storage");
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`http://localhost:4000/api/signup/customer-by-email/${email}`);
                if (res.data.success && res.data.customer) {
                    setProfile(res.data.customer);
                    setEditPhone(res.data.customer.phone || "");
                    setEditDietary(res.data.customer.dietaryNeeds || "");
                } else {
                    setError("Customer not found");
                }
            } catch (err) {
                setError("Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccess("");
        setError("");
        try {
            const res = await axios.patch(`http://localhost:4000/api/signup/customer-by-email/${profile.email}`, {
                phone: editPhone,
                dietaryNeeds: editDietary
            });
            if (res.data.success) {
                setProfile(res.data.customer);
                setSuccess("Profile updated successfully");
            } else {
                setError(res.data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <><CustHeader /><div>Loading profile...</div></>;
    if (error) return <><CustHeader /><div style={{color: 'red'}}>{error}</div></>;
    if (!profile) return <><CustHeader /><div>No profile found.</div></>;

    return (
        <>
            <CustHeader />
            <div style={{maxWidth: 500, margin: '40px auto', padding: 24, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
                <h2 style={{marginBottom: 24}}>My Profile</h2>
                <div style={{marginBottom: 18}}>
                    <label><strong>Name:</strong></label>
                    <div style={{padding: '8px 0'}}>{profile.name}</div>
                </div>
                <div style={{marginBottom: 18}}>
                    <label><strong>Email:</strong></label>
                    <div style={{padding: '8px 0'}}>{profile.email}</div>
                </div>
                <div style={{marginBottom: 18}}>
                    <label><strong>Address:</strong></label>
                    <div style={{padding: '8px 0'}}>{profile.address}</div>
                </div>
                <div style={{marginBottom: 18}}>
                    <label><strong>Phone:</strong></label>
                    <input
                        type="text"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc'}}
                    />
                </div>
                <div style={{marginBottom: 18}}>
                    <label><strong>Dietary Needs:</strong></label>
                    <textarea
                        value={editDietary}
                        onChange={e => setEditDietary(e.target.value)}
                        style={{width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 60}}
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{background: '#3b82f6', color: 'white', padding: '10px 24px', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'}}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                {success && <div style={{color: 'green', marginTop: 16}}>{success}</div>}
                {error && <div style={{color: 'red', marginTop: 16}}>{error}</div>}
            </div>
        </>
    );
}

export default ViewProfile; 