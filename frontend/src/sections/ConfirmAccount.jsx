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
                    console.log('Account confirmed successfully!');
                    navigate("/login")
                    window.location.reload()
                }
            } catch (error) {
                console.log('Error confirming account: ' + error.response?.data?.message || error.message);
                window.location.href("/")
                window.location.reload()
            }
        };

        if (token) {
            confirmAccount();
        }
    }, [token, navigate]);

    return (
        <div>
            <h1 className='absolute text-3xl top-1/2 left-1/2 -translate-x-1/2 montserrat text-primary'>Confirming your account...</h1>
        </div>
    );
}

export default ConfirmAccount;