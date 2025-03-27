import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ConfirmAccount() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                const response = await fetch('http://localhost:9000/confirm-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to confirm account');
                }

                if (data.success) {
                    alert('Account confirmed successfully!');
                    navigate('/login');
                }
            } catch (error) {
                alert('Error confirming account: ' + error.response?.data?.message || error.message);
                navigate('/');
            }
        };

        if (token) {
            confirmAccount();
        }
    }, [token, navigate]);

    return (
        <div>
            <h1>Confirming your account...</h1>
        </div>
    );
}

export default ConfirmAccount;